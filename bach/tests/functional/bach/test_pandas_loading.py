"""
Copyright 2021 Objectiv B.V.
"""
from bach import SeriesBoolean, SeriesInt64, SeriesString, \
    SeriesFloat64, SeriesTimestamp, DataFrame
import datetime

from tests.unit.bach.util import get_pandas_df, FakeEngine


# TODO: move below functions to unit test directory
def test_string_as_index(dialect):
    TEST_DATA_SUPPORTED_TYPES = [
        ['fierljeppen', 1.32, 4, datetime.datetime(2015, 12, 13, 9, 54, 45, 543), True]
    ]

    engine = FakeEngine(dialect=dialect)
    df = DataFrame.from_pandas(
        engine=engine,
        df=get_pandas_df(TEST_DATA_SUPPORTED_TYPES, ['string', 'float', 'int', 'timestamp', 'bool']),
        convert_objects=True,
    )
    assert isinstance(df['float'], SeriesFloat64)
    assert isinstance(df['int'], SeriesInt64)
    assert isinstance(df['timestamp'], SeriesTimestamp)
    assert isinstance(df['string'], SeriesString)
    assert isinstance(df['bool'], SeriesBoolean)
    assert df.index_dtypes == {'_index_string': 'string'}


def test_load_df_without_conversion(dialect):
    TEST_DATA_SUPPORTED_TYPES = [
        [1.32, 4, datetime.datetime(2015, 12, 13, 9, 54, 45, 543), True]
    ]

    engine = FakeEngine(dialect=dialect)
    df = DataFrame.from_pandas(
        engine=engine,
        df=get_pandas_df(TEST_DATA_SUPPORTED_TYPES, ['float', 'int', 'timestamp', 'bool']),
        convert_objects=False,
    )
    assert isinstance(df['float'], SeriesFloat64)
    assert isinstance(df['int'], SeriesInt64)
    assert isinstance(df['timestamp'], SeriesTimestamp)
    assert isinstance(df['bool'], SeriesBoolean)
