# TODO maybe combine this with int into numeric series tests?
# TODO test basics
# TODO test type conversions
# TODO test aggregation functions
import math
from unittest.mock import ANY

import pandas as pd

from bach import SeriesFloat64, DataFrame
from bach.testing import assert_equals_data
from tests.functional.bach.test_data_and_utils import get_df_with_test_data
from tests.functional.bach.test_series_numeric import helper_test_simple_arithmetic


def test_from_value(engine):
    a = 123.45
    b = -123.45
    c = -0.0
    d = float('nan')
    e = float('infinity')
    f = float('-infinity')
    g = None

    bt = get_df_with_test_data(engine)[['city']]
    bt['a'] = a
    bt['b'] = b
    bt['c'] = c
    bt['d'] = d
    bt['e'] = e
    bt['f'] = f
    bt['g'] = SeriesFloat64.from_value(base=bt, value=g, name='tmp')
    # check column d separately as `nan == nan` always evaluates to False
    db_values = assert_equals_data(
        bt,
        expected_columns=['_index_skating_order', 'city', 'a', 'b', 'c', 'd', 'e', 'f', 'g'],
        expected_data=[
            [1, 'Ljouwert', a, b, c, ANY, e, f, g],
            [2, 'Snits', a, b, c, ANY, e, f, g],
            [3, 'Drylts', a, b, c, ANY, e, f, g]
        ]
    )
    for row in db_values:
        assert math.isnan(row[5])


def test_float_int_arithmetic(engine):
    helper_test_simple_arithmetic(engine=engine, a=20.01, b=3)


def test_float_float_arithmetic(engine):
    helper_test_simple_arithmetic(engine=engine, a=20.01, b=3.33)


def test_random(engine):
    bt = get_df_with_test_data(engine)[['city']]
    bt['random_float'] = SeriesFloat64.random(base=bt)
    result = bt.to_pandas()
    assert list(result.columns) == ['city', 'random_float']
    distinct_values = set()
    for value in result['random_float'].values:
        assert isinstance(value, float)
        assert 0 <= value < 1
        # We cannot check whether the generated numbers are random. But we can check
        # that there are no duplicates. The chance of having a duplicate random number in
        # 3 rows of data with 64 bit random numbers is so small we just discard that.
        assert value not in distinct_values
        distinct_values.add(value)


def test__eq__nan(engine):
    pdf = pd.DataFrame(data={'a': [1, 2, 3, 4, 5]})
    df = DataFrame.from_pandas(df=pdf, engine=engine, convert_objects=True)

    nan_value = float('nan')
    df.loc[(df['a'] == 2) | (df['a'] == 4),  'a'] = nan_value
    df['is_nan'] = df['a'] == nan_value

    assert_equals_data(
        df,
        expected_columns=['_index_0', 'a', 'is_nan'],
        expected_data=[
            [0,         1., False],
            [1,  nan_value,  True],
            [2,         3., False],
            [3,  nan_value,  True],
            [4,         5., False],
        ],
    )
