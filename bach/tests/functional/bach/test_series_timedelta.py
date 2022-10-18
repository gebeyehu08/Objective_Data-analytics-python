"""
Copyright 2021 Objectiv B.V.
"""
import datetime

import numpy as np
import pandas as pd
import pytest

from bach import DataFrame, SeriesTimedelta
from sql_models.util import is_athena
from tests.functional.bach.test_data_and_utils import get_df_with_test_data, get_df_with_food_data
from tests.functional.bach.test_series_timestamp import types_plus_min

from bach.testing import assert_equals_data


def test_timedelta_arithmetic(engine):
    data = [
        ['d', datetime.date(2020, 3, 11), 'date', ('date', None)],
        ['t', datetime.time(23, 11, 5), 'time', (None, None)],
        ['td', datetime.timedelta(days=321, seconds=9877), 'timedelta', ('timedelta', 'timedelta')],
        ['dt', datetime.datetime(2021, 5, 3, 11, 28, 36, 388000), 'timestamp', ('timestamp', None)]
    ]

    types_plus_min(engine, data, datetime.timedelta(days=123, seconds=5621), 'timedelta')


def test_timedelta_arithmetic2(engine):
    bt = get_df_with_test_data(engine, full_data_set=True)[['inhabitants']]
    td = datetime.timedelta(days=365, seconds=9877)
    td2 = datetime.timedelta(days=23, seconds=12)

    bt['td'] = np.timedelta64(td)
    bt['td2'] = td2
    expected = [td, td2]
    expected_types = ['timedelta', 'timedelta']

    # special timedelta ops only, rest is tested elsewhere
    bt['mul'] = bt.td * 5
    bt['div'] = bt.td / 5
    expected.extend([td * 5, td / 5])
    expected_types.extend(['timedelta', 'timedelta'])

    assert [s.dtype for s in list(bt.all_series.values())[2:]] == expected_types

    assert_equals_data(
        bt.sort_index()[:1],
        expected_columns=list(bt.all_series.keys()),
        expected_data=[
            [1, 93485, *expected],
        ],
        use_to_pandas=True,
    )


def test_timedelta(engine):
    mt = get_df_with_food_data(engine)[['skating_order', 'moment']]

    # import code has no means to distinguish between date and timestamp
    gb = mt.groupby([]).aggregate({'moment': ['min', 'max']})
    gb['delta'] = gb['moment_max'] - gb['moment_min']

    assert_equals_data(
        gb,
        expected_columns=['moment_min', 'moment_max', 'delta'],
        expected_data=[
            [
                datetime.datetime(2021, 5, 3, 11, 28, 36, 388000),
                datetime.datetime(2022, 5, 3, 14, 13, 13, 388000),
                datetime.timedelta(days=365, seconds=9877),
            ]
        ],
        use_to_pandas=True,
    )

    r2 = gb[['delta']].groupby().mean()
    assert_equals_data(
        r2,
        expected_columns=['delta_mean'],
        expected_data=[
            [datetime.timedelta(days=365, seconds=9877)]
        ],
        use_to_pandas=True,
    )

    r3 = r2['delta_mean'] + datetime.timedelta()
    assert_equals_data(
        r3,
        expected_columns=['delta_mean'],
        expected_data=[
            [datetime.timedelta(days=365, seconds=9877)]
        ],
        use_to_pandas=True,
    )

    r4 = gb[['delta']].groupby().mode()
    assert_equals_data(
        r4,
        expected_columns=['delta_mode'],
        expected_data=[
            [datetime.timedelta(days=365, seconds=9877)]
        ],
        use_to_pandas=True,
    )


def test_to_pandas(engine):
    bt = get_df_with_test_data(engine)
    bt['td'] = datetime.timedelta(days=321, seconds=9877)
    bt[['td']].to_pandas()
    # TODO, this is not great, but at least it does not error when imported into pandas,
    # and it looks good over there
    assert bt[['td']].to_numpy()[0] == [27744277000000000]


def test_timedelta_operations(engine):
    pdf = pd.DataFrame(
        data={
            'start_date': [
                datetime.datetime(year=2022, month=1, day=d) for d in range(1, 17)
            ],
            'end_date': [
                datetime.datetime(year=2022, month=m, day=d) for m in range(2, 4) for d in range(1, 9)
            ]
        }
    )
    df = DataFrame.from_pandas(engine=engine, df=pdf, convert_objects=True)

    pdf['diff'] = pdf['end_date'] - pdf['start_date']
    df['diff'] = df['end_date'] - df['start_date']

    result = df['diff'].quantile(q=[0.25, 0.5, .75])
    expected = pdf['diff'].quantile(q=[0.25, 0.5, .75])
    np.testing.assert_equal(expected.to_numpy(), result.sort_index().to_numpy())


def test_timedelta_dt_properties(engine) -> None:
    unit = 'ms' if is_athena(engine) else 'us'
    pdf = pd.DataFrame(
        data={
            'start_date': [
                np.datetime64("2022-01-01 12:34:56.7800", unit),
                np.datetime64("2022-01-05 01:23:45.6700", unit),
                np.datetime64("2022-01-10 02:34:56.7800", unit),
                np.datetime64("2020-12-10 02:34:56.7800", unit),
                np.datetime64("2022-01-05 01:23:45.1234567", unit),
                np.datetime64("2022-01-05 01:23:45.6700", unit),
                np.datetime64("2022-01-03", unit),
            ],
            'end_date': [
                np.datetime64("2022-01-03", unit),
                np.datetime64("2022-01-06", unit),
                np.datetime64("2022-01-10", unit),
                np.datetime64("2022-01-10", unit),
                np.datetime64("2022-01-05 01:23:45.7700", unit),
                np.datetime64("1999-12-31 01:23:45.6700", unit),
                np.datetime64("2022-01-01 12:34:56.7800", unit),
            ]
        }
    )
    df = DataFrame.from_pandas(engine=engine, df=pdf, convert_objects=True)

    pdf['diff'] = pdf['end_date'] - pdf['start_date']
    df['diff'] = df['end_date'] - df['start_date']

    dt_properties = ['days', 'seconds', 'microseconds']
    # properties df might have a different base node from parent timedelta series
    total_seconds_df = df['diff'].dt.total_seconds.to_frame()
    properties_df = total_seconds_df.copy_override(
        series={
            p: getattr(df['diff'].dt, p)
            for p in dt_properties
        }
    )
    properties_pdf = pd.DataFrame(data={p: getattr(pdf['diff'].dt, p) for p in dt_properties})

    pd.testing.assert_frame_equal(
        properties_pdf,
        properties_df.sort_index().to_pandas(),
        check_dtype=False,
        check_names=False,
    )

    properties_df['total_seconds'] = df['diff'].dt.total_seconds

    row_w_diff_precision = [0.,       0., 646544.,     0.64654]
    if is_athena(engine):
        # athena supports till milliseconds, therefore components might be rounded
        row_w_diff_precision = [0.,       0., 647000.,     0.64700]

    expected_data = [
        [1.,   41103., 220000.,   127503.22],
        [0.,   81374., 330000.,    81374.33],
        [-1.,  77103., 220000.,    -9296.78],
        [395., 77103., 220000., 34205103.22],
        row_w_diff_precision,
        [-8041.,   0.,      0., -694742400.],
        [-2.,  45296., 780000.,  -127503.22],
    ]
    np.testing.assert_almost_equal(
        expected_data, properties_df.sort_index().to_numpy(), decimal=4,
    )


def test_timedelta_dt_components(engine) -> None:
    unit = 'ms' if is_athena(engine) else 'us'
    pdf = pd.DataFrame(
        data={
            'start_date': [
                np.datetime64("2022-01-01 12:34:56.7800", unit),
                np.datetime64("2022-01-05 01:23:45.6700", unit),
                np.datetime64("2022-01-05 01:23:45.1234567", unit),
                np.datetime64("2022-01-05 01:23:45.6700", unit),
                np.datetime64("2022-01-03", unit),
            ],
            'end_date': [
                np.datetime64("2022-01-03", unit),
                np.datetime64("2022-01-06", unit),
                np.datetime64("2022-01-05 01:23:45.7700", unit),
                np.datetime64("1999-12-31 01:23:45.6700", unit),
                np.datetime64("2022-01-01 12:34:56.7800", unit),
            ]
        }
    )
    df = DataFrame.from_pandas(engine=engine, df=pdf, convert_objects=True)

    pdf['diff'] = pdf['end_date'] - pdf['start_date']
    df['diff'] = df['end_date'] - df['start_date']

    components = ['days', 'hours', 'minutes', 'seconds', 'milliseconds']
    result = df['diff'].dt.components.sort_index().to_pandas()[components]
    expected = pdf['diff'].dt.components[components]

    pd.testing.assert_frame_equal(expected, result, check_names=False)


@pytest.mark.skip_postgres('BigQuery specific test')
@pytest.mark.skip_athena('BigQuery specific test')
def test_mean_bigquery_remove_nano_precision(engine) -> None:
    pdf = pd.DataFrame(
        {
            'timedelta': [
                pd.Timedelta(microseconds=0),
                pd.Timedelta(microseconds=0),
                pd.Timedelta(microseconds=0),
                pd.Timedelta(microseconds=0),
                pd.Timedelta(microseconds=3000),
                pd.Timedelta(microseconds=1000),
                pd.Timedelta(microseconds=4000),
            ]
        }
    )
    df = DataFrame.from_pandas(engine, pdf, convert_objects=True)

    pandas_timedelta_mean = pdf.mean()
    assert pandas_timedelta_mean.dt.nanoseconds.values[0] > 0

    expected = pandas_timedelta_mean.dt.round(freq='us').values[0]
    result = df['timedelta'].mean().reset_index(drop=True)

    assert_equals_data(
        result,
        expected_columns=['timedelta'],
        expected_data=[[expected]],
        use_to_pandas=True,
    )


def test_from_total_seconds(engine) -> None:
    pdf = pd.DataFrame(
        data={
            'total_seconds': [
                127503.22,
                81374.33,
                0.64654,
                -694742400,
                -127503.22
            ]
        }
    )
    df = DataFrame.from_pandas(engine=engine, df=pdf, convert_objects=True)
    result = SeriesTimedelta.from_total_seconds(df['total_seconds'])

    assert_equals_data(
        result,
        expected_columns=['_index_0', 'total_seconds'],
        expected_data=[
            [0, datetime.timedelta(seconds=127503.22)],
            [1, datetime.timedelta(seconds=81374.33)],
            [2, datetime.timedelta(seconds=0.64654)],
            [3, datetime.timedelta(seconds=-694742400)],
            [4, datetime.timedelta(seconds=-127503.22)],
        ],
        use_to_pandas=True,
    )


def test_timedelta_to_str(engine):
    pdf = pd.DataFrame(
        {
            'timedelta': [
                datetime.timedelta(seconds=127503.22),
                datetime.timedelta(seconds=81374.33),
                datetime.timedelta(seconds=0.64654),
                datetime.timedelta(seconds=-694742400),
                datetime.timedelta(seconds=-127503.22),
            ]
        }
    )
    df = DataFrame.from_pandas(engine=engine, df=pdf, convert_objects=True)
    result = df['timedelta'].astype('string')

    row_3 = "0 days, 00:00:00.646540"
    # value gets rounded do to precision
    if is_athena(engine):
        row_3 = "0 days, 00:00:00.647000"

    assert_equals_data(
        result,
        expected_columns=['_index_0', 'timedelta'],
        expected_data=[
            [0, "1 days, 11:25:03.220000"],
            [1, "0 days, 22:36:14.330000"],
            [2, row_3],
            [3, "-8041 days, 00:00:00.000000"],
            [4, "-2 days, 12:34:56.780000"],
        ]
    )
