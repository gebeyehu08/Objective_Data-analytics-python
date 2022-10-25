from typing import NamedTuple

import pytest

from bach.expression import Expression
from bach.sql_model import BachSqlModel
from bach.utils import get_merged_series_dtype, is_valid_column_name, SortColumn, \
    validate_node_column_references_in_sorting_expressions, get_name_from_sql_column_name, \
    get_sql_column_name, merge_sql_statements
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
                       '__esc_krsxg5a',
                       '__esc_krsxg5a'),
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
                       '__esc_gaytemzugv2gk43u'),
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
                       '__esc_gbptambogesq',
                       '__esc_gbptambogesq'),
        ColNameEncoded('_X!@',
                       '_X!@',
                       '__esc_l5mccqa',
                       '__esc_l5mccqa'),
        ColNameEncoded('test_X!@_test_123',
                       'test_X!@_test_123',
                       '__esc_orsxg5c7laquax3umvzxixzrgizq',
                       '__esc_orsxg5c7laquax3umvzxixzrgizq'),
        ColNameEncoded('Aa_!#!$*(aA®Řﬦ‎	⛔',
                       'Aa_!#!$*(aA®Řﬦ‎	⛔',
                       '__esc_ifqv6ijdeescukdbihbk5rmy56wknyuarye6fg4u',
                       '__esc_ifqv6ijdeescukdbihbk5rmy56wknyuarye6fg4u')
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


def test_get_sql_column_name_back_and_forth(dialect):
    # Test that:
    # 1. get_sql_column_name() can turn series names into valid column name.
    # 2. get_name_from_sql_column_name() can translate the column names back to series names.
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
        reverted_name = get_name_from_sql_column_name(name)
        assert is_valid_column_name(dialect, sql_column_name)
        assert name == reverted_name


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
