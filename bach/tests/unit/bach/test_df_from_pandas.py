"""
Copyright 2022 Objectiv B.V.
"""
from datetime import datetime

import pytest

from bach import DataFrame, SeriesFloat64, SeriesInt64, SeriesTimestamp, SeriesString, SeriesBoolean
from bach.from_pandas import _assert_column_names_valid
from tests.unit.bach.test_utils import ColNameValid
from tests.unit.bach.util import get_pandas_df, FakeEngine


def test__assert_column_names_valid_generic(dialect):
    # check for duplicates and for non-named columns
    data = [[1, 2, 3], [3, 4, 5]]
    column_names = ['a', 'b', 'c']
    pdf = get_pandas_df(dataset=data, columns=column_names)
    # OK, columns are 'a', 'b', and 'c'
    _assert_column_names_valid(dialect=dialect, df=pdf)

    # Not OK: column name 'a' appears twice
    pdf.columns = ['a', 'b', 'a']
    with pytest.raises(ValueError, match='Duplicate column names'):
        _assert_column_names_valid(dialect=dialect, df=pdf)

    # Not OK: column names are not all strings
    pdf.columns = ['a', 'b', 0]
    with pytest.raises(ValueError, match='Not all columns names are strings'):
        _assert_column_names_valid(dialect=dialect, df=pdf)


    # Not OK: second column has no name
    pdf.columns = ['a', None, 'c']
    with pytest.raises(ValueError, match='Not all columns names are strings'):
        _assert_column_names_valid(dialect=dialect, df=pdf)


def test__assert_column_names_valid_db_specific(dialect):
    # test whether column names are allowed for specific dialects
    # We'll just test a few combinations here
    tests = [
        #            column name              PG    Athena BQ
        ColNameValid('test',                  True,  True,  True),
        ColNameValid('test' * 15 + 'test',    False, True,  True),   # 64 characters
        ColNameValid('abcdefghij' * 30 + 'a', False, False, False),  # 301 characters
        ColNameValid('#@*&O*JALDSJK',         True,  True, True),    # Can be encoded as valid column name
    ]
    for test in tests:
        data = [[1, 2, 3], [3, 4, 5]]
        column_names = ['a', 'b', test.name]
        pdf = get_pandas_df(dataset=data, columns=column_names)
        expected = getattr(test, dialect.name)
        if expected:
            _assert_column_names_valid(dialect=dialect, df=pdf)
        else:
            msg = f'Column name ".*" is not valid for SQL dialect {dialect.name}, and cannot be escaped.'
            with pytest.raises(ValueError, match=msg):
                _assert_column_names_valid(dialect=dialect, df=pdf)


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
