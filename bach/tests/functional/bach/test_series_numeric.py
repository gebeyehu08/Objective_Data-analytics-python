import math
from typing import Union

import numpy as np
import pandas as pd
from sqlalchemy.engine import Engine

from bach import DataFrame
from tests.functional.bach.test_data_and_utils import get_df_with_test_data
from bach.testing import assert_equals_data

def helper_test_simple_arithmetic(engine: Engine, a: Union[int, float], b: Union[int, float]):
    """
    Helper function that tests that the outcome of a whole list of arithmetic operations between a and b
    matches the outcome of doing the same operation in python.
    """
    bt = get_df_with_test_data(engine)[['inhabitants']]
    expected = []
    bt['a'] = a
    bt['b'] = b
    expected.extend([a, b])
    bt['plus'] = bt.a + bt.b
    bt['min'] = bt.a - bt.b
    bt['mul'] = bt.a * bt.b
    bt['div'] = bt.a / bt.b
    bt['floordiv1'] = bt.a // bt.b
    bt['floordiv2'] = bt.a // 5.1
    bt['pow'] = bt.a ** bt.b
    bt['mod'] = bt.b % bt.a
    expected.extend([a + b, a - b, a * b, a / b, a // b, a // 5.1, a ** b, b % a])

    # result should be constant because both a and b are constant
    assert all(s.expression.is_constant for s in list(bt.data.values())[-8:])

    # result should be single because both a and b are single
    assert all(s.expression.is_constant for s in list(bt.data.values())[-8:])

    assert_equals_data(
        bt.sort_index()[:1],
        expected_columns=list(bt.all_series.keys()),
        expected_data=[
            [1, 93485, *expected],
        ]
    )


def test_round(engine):
    values = [1.9, 3.0, 4.123, 6.425124, 2.00000000001, 2.1, np.nan, 7.]
    pdf = pd.DataFrame(data={'num': values})
    bt = DataFrame.from_pandas(engine=engine, df=pdf)
    bt['const'] = 14.12345
    assert bt.const.expression.is_constant

    result = bt.drop(columns=['const']).reset_index(drop=True)
    for i in 0, 3, 5, 9:
        assert bt.const.round(i).expression.is_constant
        assert not bt['num'].round(i).expression.is_constant

        result[f'num_round_{i}'] = bt['num'].round(i)
        pdf[f'num_round_{i}'] = pdf['num'].round(i)

    pd.testing.assert_frame_equal(
        pdf.sort_values(by='num').reset_index(drop=True),
        result.sort_values(by='num').to_pandas()
    )


def test_round_integer(engine):
    values = [1, 3, 4, 6, 2, 2, 6, 7]
    pdf = pd.DataFrame(data={'num': values})
    bt = DataFrame.from_pandas(engine=engine, df=pdf)

    result = bt.reset_index(drop=True)

    for i in 0, 3, 5, 9:
        result[f'num_round_{i}'] = bt['num'].round(decimals=i)
        pdf[f'num_round_{i}'] = pdf['num'].round(decimals=i)

    pd.testing.assert_frame_equal(
        pdf.sort_values(by='num').reset_index(drop=True),
        result.sort_values(by='num').to_pandas()
    )


def test_aggregations_simple_tests(engine):
    values = [1, 3, 4, 6, 2, 2, np.nan, 7, 8]
    pdf = pd.DataFrame(data={'num': values})
    bt = DataFrame.from_pandas(engine=engine, df=pdf)

    numeric_agg = ['sum', 'mean']
    stats_agg = ['sem', 'std', 'var']
    for agg in numeric_agg + stats_agg:
        pd_agg = pdf['num'].agg(agg)
        bt_agg = bt['num'].agg(agg)
        assert bt_agg.expression.has_aggregate_function
        assert not bt_agg.expression.is_constant
        assert bt_agg.expression.is_single_value
        assert pd_agg == bt_agg.value


def test_aggregations_sum_mincount(engine):
    pdf = pd.DataFrame(data={'num': [1, np.nan, 7, 8]})
    bt = DataFrame.from_pandas(engine=engine, df=pdf)

    for i in [5, 4, 3]:
        pd_agg = pdf.sum(min_count=i)['num']
        bt_agg = bt.sum(min_count=i)['num_sum']

        # since sum is wrapped in a CASE WHEN, we need to make sure that these are still valid:
        assert bt_agg.expression.has_aggregate_function
        assert not bt_agg.expression.is_constant
        assert bt_agg.expression.is_single_value

        bt_agg_value = bt_agg.value

        # We have different nan handling: nan vs None
        assert (math.isnan(pd_agg) and bt_agg_value is None) or bt_agg_value == pd_agg


def test_aggregations_quantile(engine):
    pdf = pd.DataFrame(data={'a': range(5), 'b': [1, 3, 5, 7, 9]})
    bt = DataFrame.from_pandas(engine=engine, df=pdf)

    quantiles = [0.25, 0.3, 0.5, 0.75, 0.86]

    for column, quantile in zip(pdf.columns, quantiles):
        expected = pdf[column].quantile(q=quantile)
        result = bt[column].quantile(q=quantile).to_numpy()[0]
        assert round(expected, 10) == round(result, 10)

    for column in pdf.columns:
        expected_all_quantiles = pdf[column].quantile(q=quantiles)
        result_all_quantiles = bt[column].quantile(q=quantiles).sort_index()
        pd.testing.assert_series_equal(expected_all_quantiles, result_all_quantiles.to_pandas(), check_names=False)


def test_grouped_quantile(engine):
    pdf = pd.DataFrame(data={'a': range(5), 'b': ['a', 'a', 'a', 'b', 'b']})
    bt = DataFrame.from_pandas(engine=engine, df=pdf)

    quantiles = [0.25, 0.3, 0.5, 0.75, 0.86]

    expected = pdf.groupby('b')['a'].quantile(q=quantiles)
    result = bt.groupby('b')['a'].quantile(q=quantiles).sort_index()
    pd.testing.assert_series_equal(expected, result.to_pandas(), check_names=False)


def test_series_cut(engine) -> None:
    bins = 4
    inhabitants = get_df_with_test_data(engine, full_data_set=True)['inhabitants']

    # right == true
    result_right = inhabitants.cut(bins=bins).sort_index()
    bounds_right = 'right'

    bin1_right = pd.Interval(607.215, 23896.25, bounds_right)
    bin2_right = pd.Interval(23896.25, 47092.5, bounds_right)
    bin4_right = pd.Interval(70288.75, 93485, bounds_right)

    assert_equals_data(
        result_right,
        expected_columns=['inhabitants', 'range'],
        expected_data=[
            [700, bin1_right],
            [870, bin1_right],
            [960, bin1_right],
            [3055, bin1_right],
            [4440, bin1_right],
            [10120, bin1_right],
            [12675, bin1_right],
            [12760, bin1_right],
            [14740, bin1_right],
            [33520, bin2_right],
            [93485, bin4_right],
        ],
        use_to_pandas=True
    )

    # right == false
    result_not_right = inhabitants.cut(bins=bins, right=False).sort_index()
    left_bounds = 'left'

    bin1_not_right = pd.Interval(700., 23896.25, left_bounds)
    bin2_not_right = pd.Interval(23896.25, 47092.5, left_bounds)
    bin4_not_right = pd.Interval(70288.75, 93577.785, left_bounds)
    assert_equals_data(
        result_not_right,
        expected_columns=['inhabitants', 'range'],
        expected_data=[
            [700, bin1_not_right],
            [870, bin1_not_right],
            [960, bin1_not_right],
            [3055, bin1_not_right],
            [4440, bin1_not_right],
            [10120, bin1_not_right],
            [12675, bin1_not_right],
            [12760, bin1_not_right],
            [14740, bin1_not_right],
            [33520, bin2_not_right],
            [93485, bin4_not_right],
        ],
        use_to_pandas=True
    )

    inhabitants_pdf = inhabitants.to_pandas()

    to_assert = [
        (pd.cut(inhabitants_pdf, bins=bins).sort_values(), result_right),
        (pd.cut(inhabitants_pdf, bins=bins, right=False).sort_values(), result_not_right),
    ]
    for expected_pdf, result in to_assert:
        for exp, res in zip(expected_pdf.to_numpy(), result.to_numpy()):
            np.testing.assert_almost_equal(exp.left, float(res.left), decimal=2)
            np.testing.assert_almost_equal(exp.right, float(res.right), decimal=2)


def test_series_qcut(engine) -> None:
    bounds = 'right'
    inhabitants = get_df_with_test_data(engine, full_data_set=True)['inhabitants']

    result = inhabitants.qcut(q=4).sort_index()
    bin1 = pd.Interval(699.999, 2007.5, closed=bounds)
    bin2 = pd.Interval(2007.5, 10120., closed=bounds)
    bin3 = pd.Interval(10120., 13750., closed=bounds)
    bin4 = pd.Interval(13750., 93485., closed=bounds)

    assert_equals_data(
        result,
        expected_columns=['inhabitants', 'q_range'],
        expected_data=[
            [700, bin1],
            [870, bin1],
            [960, bin1],
            [3055, bin2],
            [4440, bin2],
            [10120, bin2],
            [12675, bin3],
            [12760, bin3],
            [14740, bin4],
            [33520, bin4],
            [93485, bin4],
        ],
        use_to_pandas=True,
    )

    result2 = inhabitants.qcut(q=[0.25, 0.5]).sort_index()

    bin2 = pd.Interval(2007.499, 10120., closed=bounds)

    assert_equals_data(
        result2,
        expected_columns=['inhabitants', 'q_range'],
        expected_data=[
            [700, None],
            [870, None],
            [960, None],
            [3055, bin2],
            [4440, bin2],
            [10120, bin2],
            [12675, None],
            [12760, None],
            [14740, None],
            [33520, None],
            [93485, None],
        ],
        use_to_pandas=True,
    )

    inhabitants_pdf = inhabitants.to_pandas().sort_values()
    to_assert = [
        (pd.qcut(inhabitants_pdf, q=4), result),
        (pd.qcut(inhabitants_pdf, q=[0.25, 0.5]), result2),
    ]
    for expected_pdf, result in to_assert:
        for exp, res in zip(expected_pdf.to_numpy(), result.to_numpy()):
            if not isinstance(exp, pd.Interval):
                assert np.isnan(res) or res is None
                continue
            np.testing.assert_almost_equal(exp.left, float(res.left), decimal=2)
            np.testing.assert_almost_equal(exp.right, float(res.right), decimal=2)


def test_series_scale(engine) -> None:
    inhabitants = get_df_with_test_data(engine, full_data_set=True)['inhabitants']
    result = inhabitants.scale()

    inhbt_values = inhabitants.to_numpy()
    inhbt_avg = np.mean(inhbt_values)
    inhbt_std = np.var(inhbt_values)
    inhbt_scale = inhbt_std ** 0.5

    expected_data_w_mean_std = [
        [1, (93485 - inhbt_avg) / inhbt_scale],
        [2, (33520 - inhbt_avg) / inhbt_scale],
        [3, (3055 - inhbt_avg) / inhbt_scale],
        [4, (700 - inhbt_avg) / inhbt_scale],
        [5, (960 - inhbt_avg) / inhbt_scale],
        [6, (870 - inhbt_avg) / inhbt_scale],
        [7, (4440 - inhbt_avg) / inhbt_scale],
        [8, (10120 - inhbt_avg) / inhbt_scale],
        [9, (14740 - inhbt_avg) / inhbt_scale],
        [10, (12760 - inhbt_avg) / inhbt_scale],
        [11, (12675 - inhbt_avg) / inhbt_scale],
    ]
    assert_equals_data(
        result.to_frame(),
        expected_columns=['_index_skating_order', 'inhabitants'],
        expected_data=expected_data_w_mean_std,
        round_decimals=True,
    )


def test_series_minmax_scale(engine) -> None:
    inhabitants = get_df_with_test_data(engine, full_data_set=True)['inhabitants']
    result = inhabitants.minmax_scale()

    min_inh = 700
    max_inh = 93485
    diff_inh = max_inh - min_inh

    expected_data_default = [
        [1, (93485 - min_inh) / diff_inh],
        [2, (33520 - min_inh) / diff_inh],
        [3, (3055 - min_inh) / diff_inh],
        [4, (700 - min_inh) / diff_inh],
        [5, (960 - min_inh) / diff_inh],
        [6, (870 - min_inh) / diff_inh],
        [7, (4440 - min_inh) / diff_inh],
        [8, (10120 - min_inh) / diff_inh],
        [9, (14740 - min_inh) / diff_inh],
        [10, (12760 - min_inh) / diff_inh],
        [11, (12675 - min_inh) / diff_inh],
    ]
    assert_equals_data(
        result.to_frame(),
        expected_columns=['_index_skating_order', 'inhabitants'],
        expected_data=expected_data_default,
        round_decimals=True,
    )


def test_exp(engine) -> None:
    skating_order = get_df_with_test_data(engine, full_data_set=True)['skating_order']
    result = skating_order.exp()
    assert_equals_data(
        result,
        expected_columns=['_index_skating_order', 'skating_order'],
        expected_data=[
            [1, 2.718281828459045],
            [2, 7.38905609893065],
            [3, 20.085536923187668],
            [4, 54.598150033144236],
            [5, 148.4131591025766],
            [6, 403.4287934927351],
            [7, 1096.6331584284585],
            [8, 2980.9579870417283],
            [9, 8103.083927575384],
            [10, 22026.465794806718],
            [11, 59874.14171519782]
        ],
        # on Athena exp(1) can evalaute to two different values:
        # `2.718281828459045`
        # `2.7182818284590455`
        # This might be a result of the query being executed by servers with different in CPU architectures.
        # Bottom-line: We don't really care about such precision, so we round to 14 decimals here.
        round_decimals=True,
        decimal=14
    )


def test_astype_to_string(engine):
    pdf = pd.DataFrame(
        data={
            'value_0': [123.0, 123.123456, 123.01, 123.0000],
            'value_1': [123] * 4,
            'value_2': [123.123] * 4,
            'value_3': [123.0] * 4,
            'value_4': [0] * 4,
        }
    )
    df = DataFrame.from_pandas(engine, pdf)
    df['value_1'] = df['value_1'].astype('float64')
    df['value_4'] = df['value_4'].astype('float64')

    df = df.astype(str)
    assert_equals_data(
        df,
        expected_columns=['_index_0', 'value_0', 'value_1', 'value_2', 'value_3', 'value_4'],
        expected_data=[
            [0, '123',        '123', '123.123', '123', '0'],
            [1, '123.123456', '123', '123.123', '123', '0'],
            [2, '123.01',     '123', '123.123', '123', '0'],
            [3, '123',        '123', '123.123', '123', '0']
        ]
    )
