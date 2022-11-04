from typing import NamedTuple

import pytest

from bach.expression import Expression
from bach.sql_model import BachSqlModel
from bach.utils import get_merged_series_dtype, is_valid_column_name, SortColumn, \
    validate_node_column_references_in_sorting_expressions, \
    get_sql_column_name, merge_sql_statements, athena_construct_engine_url
from sql_models.model import Materialization, CustomSqlModelBuilder
from sql_models.util import is_athena


@pytest.mark.db_independent
def test_get_merged_series_dtype() -> None:
    assert get_merged_series_dtype({'string', 'int64'}) == 'string'
    assert get_merged_series_dtype({'int64'}) == 'int64'
    assert get_merged_series_dtype({'float64', 'int64'}) == 'float64'


class ColNameValid(NamedTuple):
    name: str
    postgresql: bool
    awsathena: bool
    bigquery: bool


def test_is_valid_column_name(dialect):
    tests = [
        #            column name                              PG     Athena BQ
        ColNameValid('',                                      False, False, False),
        ColNameValid('test',                                  True,  True,  True),
        ColNameValid('test' * 15 + 'tes',                     True,  True,  True),   # 63 characters
        ColNameValid('test' * 15 + 'test',                    False, True,  True),   # 64 characters
        ColNameValid('abcdefghij' * 30 ,                      False, False, True),   # 300 characters
        ColNameValid('abcdefghij' * 30 + 'a',                 False, False, False),  # 301 characters
        ColNameValid('_index_skating_order',                  True,  True,  True),
        ColNameValid('1234',                                  True,  True,  False),
        ColNameValid('1234_test_test',                        True,  True,  False),
        ColNameValid('With_Capitals',                         True,  False, False),
        ColNameValid('__SADHDasdfasfASAUIJLKJKAHK',           True,  False, False),
        ColNameValid('with{format}{{strings}}{{}%%@#KLJLC',   True,  False, False),
        ColNameValid('Aa_!#!$*(aA®Řﬦ‎	⛔',                  True,  False, False),
        # Reserved prefixes in BigQuery
        ColNameValid('_TABLE_test',                           True,  False, False),
        ColNameValid('_FILE_test',                            True,  False, False),
        ColNameValid('_PARTITIONtest',                        True,  False, False),
        ColNameValid('_ROW_TIMESTAMPtest',                    True,  False, False),
        ColNameValid('__ROOT__test',                          True,  False, False),
        ColNameValid('_COLIDENTIFIERtest',                    True,  False, False),
    ]
    for test in tests:
        expected = getattr(test, dialect.name)
        column_name = test.name
        assert is_valid_column_name(dialect, column_name) is expected


class ColNameEncoded(NamedTuple):
    name: str
    postgresql: str
    awsathena: str
    bigquery: str


def test_get_sql_column_name(dialect):
    # Test that get_sql_column_name() correctly encodes series names for different dialects.
    tests = [
        ColNameEncoded('test',
                       'test',
                       'test',
                       'test'),
        ColNameEncoded('Test',
                       'Test',
                       'test__bs6gmepvkq',
                       'test__bs6gmepvkq'),
        ColNameEncoded('test_test',
                       'test_test',
                       'test_test',
                       'test_test'),
        ColNameEncoded('test0123456789',
                       'test0123456789',
                       'test0123456789',
                       'test0123456789'),
        ColNameEncoded('012345test',
                       '012345test',
                       '012345test',
                       '_012345test__kozpee4by6'),
        ColNameEncoded('_',
                       '_',
                       '_',
                       '_'),
        ColNameEncoded('__column0',
                       '__column0',
                       '__column0',
                       '__column0'),
        ColNameEncoded('0_00.1%',
                       '0_00.1%',
                       '0_001__bgc5mnmich',
                       '_0_001__bgc5mnmich'),
        ColNameEncoded('_X!@',
                       '_X!@',
                       '_x__owpedgg7pz',
                       '_x__owpedgg7pz'),
        ColNameEncoded('test_X!@_test_123',
                       'test_X!@_test_123',
                       'test_x_test_123__bdsu7fgwbz',
                       'test_x_test_123__bdsu7fgwbz'),
        ColNameEncoded('¼ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþ',
                       '¼ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþ',
                       '14aaaaaaceeeeiiiinooooouuuuyaaaaaaceeeeiiiinooooouuuuy__7ix4q3jx7f',
                       '_14aaaaaaceeeeiiiinooooouuuuyaaaaaaceeeeiiiinooooouuuuy__7ix4q3jx7f'),
        ColNameEncoded('¶',
                       '¶',
                       'empty__prnak4rr43',
                       'empty__prnak4rr43'),
        ColNameEncoded('¶¶',
                       '¶¶',
                       'empty__z4ywntjpwq',
                       'empty__z4ywntjpwq'),
        ColNameEncoded('Aa_!#!$*(aA®Řﬦ‎	⛔',
                       'Aa_!#!$*(aA®Řﬦ‎	⛔',
                       'aa_aar__ad4drrvdk2',
                       'aa_aar__ad4drrvdk2'),
        ColNameEncoded('__ROOT__test',
                       '__ROOT__test',
                       '__root__test__b44plskaze',
                       'x___root__test__b44plskaze')
    ]
    for test in tests:
        expected = getattr(test, dialect.name)
        column_name = test.name
        assert get_sql_column_name(dialect, column_name) == expected


def test_get_sql_column_name_raises_exception(dialect):
    # Test that get_sql_column_name() raises an exception for series names that it cannot handle properly.
    tests = [
        #            column name                              PG     Athena BQ
        ColNameValid('',                                      True,  True,  True),
        ColNameValid('test',                                  True,  True,  True),
        ColNameValid('test' * 15 + 'tes',                     True,  True,  True),   # 63 characters
        ColNameValid('test' * 15 + 'test',                    False, True,  True),   # 64 characters
        ColNameValid('abcdefghij' * 30 ,                      False, False, True),   # 300 characters
        ColNameValid('abcdefghij' * 30 + 'a',                 False, False, False),  # 301 characters
        ColNameValid('Aa_!#!$*(aA®Řﬦ‎	⛔',                  True,  True,  True),   # can be escaped
    ]
    for test in tests:
        expected = getattr(test, dialect.name)
        column_name = test.name

        # Use try-except instead of pytest.raises, because we want to give a custom error if the behaviour
        # is unexpected
        error = None
        try:
            result = get_sql_column_name(dialect, column_name)
        except ValueError as exc:
            error = exc

        case_msg = f'dialect: {dialect.name}, column_name: {column_name}'
        if expected:
            assert error is None, f'Unexpected error raised; {case_msg}; error: {error}.'
            assert result is not None, case_msg
        else:
            assert error is not None, f'Expected error not raised; {case_msg}.'


def test_get_sql_column_name_more_names(dialect):
    # Just test some additional names, to make sure they can be encoded with all dialects. Without
    # going to the trouble of defining expected outputs
    names = [
        'test',
        'test' * 15 + 'tes',
        '_index_skating_order',
        '1234',
        '1234_test_test',
        'With_Capitals',
        'with_capitals',
        '__SADHDasdfasfASAUIJLKJKAHK',
        'with{format}{{strings}}{{}%%@#KLJLC',
        'Aa_!#!$*(aA®Řﬦ‎	⛔',
        '_TABLE_test',
        '_FILE_test',
        '_PARTITIONtest',
        '_ROW_TIMESTAMPtest',
        '__ROOT__test',
        '_COLIDENTIFIERtest',
        '_',
        '__column0',
        '0_00.1%',
        '_X!@',
    ]
    for name in names:
        sql_column_name = get_sql_column_name(dialect, name)
        assert is_valid_column_name(dialect, sql_column_name)


def test_validate_sorting_expressions(dialect) -> None:
    model = BachSqlModel(
        model_spec=CustomSqlModelBuilder(sql='SELECT * FROM test', name='test'),
        placeholders={},
        references={},
        materialization=Materialization.CTE,
        materialization_name=None,
        column_expressions={
            'a': Expression.column_reference('a'),
            'b': Expression.column_reference('b'),
        },
    )

    with pytest.raises(ValueError, match=r'Sorting contains expressions referencing'):
        validate_node_column_references_in_sorting_expressions(
            dialect,
            model,
            [SortColumn(expression=Expression.column_reference('c'), asc=True)],
        )

    validate_node_column_references_in_sorting_expressions(
        dialect=dialect,
        node=model,
        order_by=[
            SortColumn(
                expression=Expression(
                    data=[
                        Expression.column_reference('b'), Expression.raw('+'), Expression.column_reference('a'),
                    ],
                ),
                asc=True
            )
        ]
    )


def test_merge_sql_statements(dialect):
    assert merge_sql_statements(dialect, []) == []
    assert merge_sql_statements(dialect, ['select test']) == ['select test']

    expected = ['select test; select x; drop table y']
    if is_athena(dialect):
        expected = ['select test', 'select x', 'drop table y']
    assert merge_sql_statements(dialect, ['select test', 'select x', 'drop table y']) == expected


@pytest.mark.db_independent('Does not take a dialect/engine as parameter')
def test_athena_construct_engine_url():
    # test that all parts of the url are properly escaped. Even if the test string is not valid for a lot
    # of these parameters. The test string contains two characters that need to be escaped: `+` and `%`
    result = athena_construct_engine_url(
        aws_access_key_id='+test%',
        aws_secret_access_key='+test%',
        region_name='+test%',
        schema_name='+test%',
        s3_staging_dir='+test%',
        athena_work_group='+test%',
        catalog_name='+test%',
    )
    assert result == (
        'awsathena+rest://%2Btest%25:%2Btest%25@athena.%2Btest%25.amazonaws.com:443/'
        '%2Btest%25'
        '?s3_staging_dir=%2Btest%25&work_group=%2Btest%25&catalog_name=%2Btest%25'
    )

    result = athena_construct_engine_url(
        aws_access_key_id='+test%',
        aws_secret_access_key='+test%',
        region_name='+test%',
        schema_name='+test%',
        s3_staging_dir='+test%',
    )
    assert result == (
        'awsathena+rest://%2Btest%25:%2Btest%25@athena.%2Btest%25.amazonaws.com:443/'
        '%2Btest%25'
        '?s3_staging_dir=%2Btest%25'
    )

    result = athena_construct_engine_url(
        aws_access_key_id='+test%',
        region_name='+test%',
        schema_name='+test%',
        s3_staging_dir='+test%',
    )
    assert result == (
        'awsathena+rest://%2Btest%25@athena.%2Btest%25.amazonaws.com:443/'
        '%2Btest%25'
        '?s3_staging_dir=%2Btest%25'
    )

    result = athena_construct_engine_url(
        region_name='+test%',
        schema_name='+test%',
        s3_staging_dir='+test%',
    )
    assert result == (
        'awsathena+rest://athena.%2Btest%25.amazonaws.com:443/'
        '%2Btest%25'
        '?s3_staging_dir=%2Btest%25'
    )
