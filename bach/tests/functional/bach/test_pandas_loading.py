"""
Copyright 2021 Objectiv B.V.
"""
import pytest

from bach import SeriesBoolean, SeriesInt64, SeriesString, \
    SeriesFloat64, SeriesTimestamp, DataFrame
from sql_models.constants import DBDialect
from tests.functional.bach.test_data_and_utils import assert_db_types

import datetime

from tests.unit.bach.util import get_pandas_df, FakeEngine


@pytest.mark.skip_bigquery_todo()
def test_all_supported_types_db_dtypes(engine):
    # TODO: move this function to test_df_from_pandas
    TEST_DATA_SUPPORTED_TYPES = [
        [1.32, 4, datetime.datetime(2015, 12, 13, 9, 54, 45, 543), 'fierljeppen', True]
    ]
    df = DataFrame.from_pandas(
        engine=engine,
        df=get_pandas_df(TEST_DATA_SUPPORTED_TYPES, ['float', 'int', 'timestamp', 'string', 'bool']),
        convert_objects=True,
    )

    all_expected_db_dtypes = {
        DBDialect.POSTGRES: {
            'float': 'double precision',
            'int': 'bigint',
            'timestamp': 'timestamp without time zone',
            'string': 'text',
            'bool': 'boolean'
        },
        DBDialect.ATHENA: {
            'float': 'double',
            'int': 'bigint',
            'timestamp': 'timestamp',
            'string': 'varchar(11)',
            'bool': 'boolean'
        }
    }
    expected_db_dtypes = all_expected_db_dtypes[DBDialect.from_engine(engine)]
    assert_db_types(df=df, series_expected_db_type=expected_db_dtypes)


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


def test_load_df_without_conversion(dialect):
    TEST_DATA_SUPPORTED_TYPES = [
        [1.32, 4, datetime.datetime(2015, 12, 13, 9, 54, 45, 543), True]
    ]

    engine = FakeEngine(dialect=dialect)
    df = DataFrame.from_pandas(
        engine=engine,
        df=get_pandas_df(TEST_DATA_SUPPORTED_TYPES, ['float', 'int', 'timestamp', 'bool']),
        convert_objects=True,
    )
    assert isinstance(df['float'], SeriesFloat64)
    assert isinstance(df['int'], SeriesInt64)
    assert isinstance(df['timestamp'], SeriesTimestamp)
    assert isinstance(df['bool'], SeriesBoolean)
