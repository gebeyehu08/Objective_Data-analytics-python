"""
Copyright 2021 Objectiv B.V.
"""
import datetime

import pandas as pd

from bach import DataFrame
from tests.functional.bach.test_data_and_utils import get_df_with_test_data
from tests.functional.bach.test_series_timestamp import types_plus_min

from bach.testing import assert_equals_data

def test_time_arithmetic(engine):
    data = [
        ['d', datetime.date(2020, 3, 11), 'date', (None, None)],
        ['t', datetime.time(23, 11, 5), 'time', (None, None)],
        ['td', datetime.timedelta(days=321, seconds=9877), 'timedelta', (None, None)],
        ['dt', datetime.datetime(2021, 5, 3, 11, 28, 36, 388000), 'timestamp', (None, None)]
    ]
    types_plus_min(engine, data, datetime.time(13, 11, 5), 'time')


def test_to_pandas(engine):
    bt = get_df_with_test_data(engine)
    bt['t'] = datetime.time(23, 11, 5, 123456)
    result_pdf = bt[['t']].to_pandas()
    assert result_pdf.to_numpy()[0] == [datetime.time(23, 11, 5, 123456)]


def test_time_to_str(engine):
    pdf = pd.DataFrame(
        data=[
            ["11:00:01.123000"], ["11:12:10"], ["13:37:00.897"],
        ],
        columns=['column'],
    )
    df = DataFrame.from_pandas(engine=engine, df=pdf, convert_objects=True)
    result = df['column'].astype('time').astype('string')
    assert_equals_data(
        result,
        expected_columns=['_index_0', 'column'],
        expected_data=[
            [0, "11:00:01.123000"],
            [1, "11:12:10.000000"],
            [2, "13:37:00.897000"],
        ]
    )
