"""
Copyright 2021 Objectiv B.V.
"""
import pytest

from sql_models.util import extract_format_fields, quote_identifier, quote_string, is_postgres, \
    is_bigquery, is_athena, ddl_quote_identifier


@pytest.mark.db_independent
def test_extract_format_fields():
    assert extract_format_fields('{test}') == {'test'}
    assert extract_format_fields('{test} more text {test}') == {'test'}
    assert extract_format_fields('text{test} more {{text}} {test2} te{x}t{test}') == {'test', 'test2', 'x'}


@pytest.mark.db_independent
def test_extract_format_fields_nested():
    # assert extract_format_fields('{test}', 2) == set()
    # assert extract_format_fields('{test} more text {test}', 2) == set()
    # assert extract_format_fields('text{test} more {{text}} {test2} te{x}t{test}', 2) == {'text'}
    assert extract_format_fields('{x} {{y}} {{{{z}}}} {a}', 1) == {'x', 'a'}
    assert extract_format_fields('{x} {{y}} {{{{z}}}} {a}', 2) == {'y'}
    assert extract_format_fields('{x} {{y}} {{{{z}}}} {a}', 3) == {'z'}
    assert extract_format_fields('{x} {{y}} {{{{z}}}}', 3) == {'z'}


def test_quote_identifier(dialect):
    if is_postgres(dialect) or is_athena(dialect):
        # Postgres spec: https://www.postgresql.org/docs/14/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS
        # Athena spec: https://prestodb.io/docs/0.217/language/reserved.html
        assert quote_identifier(dialect, 'test') == '"test"'
        assert quote_identifier(dialect, 'te"st') == '"te""st"'
        assert quote_identifier(dialect, '"te""st"') == '"""te""""st"""'
        assert quote_identifier(dialect, '`te`st`') == '"`te`st`"'
        assert quote_identifier(dialect, 'te%st') == '"te%st"'
    elif is_bigquery(dialect):
        # https://cloud.google.com/bigquery/docs/reference/standard-sql/lexical#identifiers
        assert quote_identifier(dialect, 'test') == '`test`'
        assert quote_identifier(dialect, 'te"st') == '`te"st`'
        assert quote_identifier(dialect, '"te""st"') == r'`"te""st"`'
        assert quote_identifier(dialect, '`te`st`') == r'`\`te\`st\``'
        assert quote_identifier(dialect, 'te%st') == '`te%st`'
    else:
        # if we add more dialects, we should not forget to extend this test
        raise Exception()


def test_ddl_quote_identifier(dialect):
    if is_postgres(dialect):
        # Postgres spec: https://www.postgresql.org/docs/14/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS
        assert ddl_quote_identifier(dialect, 'test') == '"test"'
        assert ddl_quote_identifier(dialect, 'te"st') == '"te""st"'
        assert ddl_quote_identifier(dialect, '"te""st"') == '"""te""""st"""'
        assert ddl_quote_identifier(dialect, '`te`st`') == '"`te`st`"'
        assert ddl_quote_identifier(dialect, 'te%st') == '"te%st"'
    elif is_athena(dialect):
        # Athena spec:
        # https://docs.aws.amazon.com/athena/latest/ug/tables-databases-columns-names.html
        # https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL#:~:text=double%20backticks%20(%60%60)%20to%20represent%20a%20backtick
        assert ddl_quote_identifier(dialect, 'test') == '`test`'
        assert ddl_quote_identifier(dialect, 'te"st') == '`te"st`'
        assert ddl_quote_identifier(dialect, '"te""st"') == r'`"te""st"`'
        assert ddl_quote_identifier(dialect, '`te`st`') == r'```te``st```'
        assert ddl_quote_identifier(dialect, 'te%st') == '`te%st`'
    elif is_bigquery(dialect):
        # BigQuery: https://cloud.google.com/bigquery/docs/reference/standard-sql/lexical#identifiers
        assert ddl_quote_identifier(dialect, 'test') == '`test`'
        assert ddl_quote_identifier(dialect, 'te"st') == '`te"st`'
        assert ddl_quote_identifier(dialect, '"te""st"') == r'`"te""st"`'
        assert ddl_quote_identifier(dialect, '`te`st`') == r'`\`te\`st\``'
        assert ddl_quote_identifier(dialect, 'te%st') == '`te%st`'
    else:
        # if we add more dialects, we should not forget to extend this test
        raise Exception()


def test_quote_string(dialect):
    if is_postgres(dialect) or is_athena(dialect):
        # Postgres: https://www.postgresql.org/docs/14/sql-syntax-lexical.html#SQL-SYNTAX-CONSTANTS
        # Athena: https://docs.aws.amazon.com/athena/latest/ug/select.html#select-escaping
        assert quote_string(dialect, "test") == "'test'"
        assert quote_string(dialect, "te'st") == "'te''st'"
        assert quote_string(dialect, "'te''st'") == "'''te''''st'''"

    elif is_bigquery(dialect):
        # https://cloud.google.com/bigquery/docs/reference/standard-sql/lexical#string_and_bytes_literals
        assert quote_string(dialect, "test") == '"""test"""'
        assert quote_string(dialect, "te'st") == '"""te\'st"""'
        assert quote_string(dialect, "'te''st'") == '"""\'te\'\'st\'"""'
    else:
        # if we add more dialects, we should not forget to extend this test
        raise Exception()