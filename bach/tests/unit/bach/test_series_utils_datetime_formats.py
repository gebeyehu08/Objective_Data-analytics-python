"""
Copyright 2022 Objectiv B.V.
"""
import pytest

from bach.series.utils.datetime_formats import parse_c_standard_code_to_postgres_code, \
    parse_c_code_to_bigquery_code, parse_c_code_to_athena_code


pytestmark = [pytest.mark.db_independent]  # mark all tests here as database independent.
# Better would be to have a mark called 'db_specific' or something like that.
# The point is that all tests in this file run are specific to a database dialect, and don't need to be run
# for all database dialects.


def test_parse_c_standard_code_to_postgres_code(recwarn):
    # single c-code
    assert parse_c_standard_code_to_postgres_code('%Y') == 'YYYY'

    # non supported c-code in bach
    assert parse_c_standard_code_to_postgres_code('%c') == '"%c"'

    # c-code supported in bach, not in postgres
    assert parse_c_standard_code_to_postgres_code('%s') == '%s'
    assert parse_c_standard_code_to_postgres_code('%Y-%%%m-%d') == 'YYYY"-"%%""MM"-"DD'

    # simple case
    assert parse_c_standard_code_to_postgres_code('%Y-%m-%d') == 'YYYY"-"MM"-"DD'

    # multiple continuous c-codes
    assert parse_c_standard_code_to_postgres_code('%Y%m-%d%d') == 'YYYY""MM"-"DD""DD'

    # date format with extra tokens in start and end
    assert parse_c_standard_code_to_postgres_code('abc %Y def%') == '"abc "YYYY" def%"'

    # continuous c-codes in single string
    assert parse_c_standard_code_to_postgres_code('%Y%Y%Y') == 'YYYY""YYYY""YYYY'

    # nested groups
    assert parse_c_standard_code_to_postgres_code('%Y%m-%Y%m%d-%Y%m-%m%d-%d') == (
        'YYYY""MM"-"YYYY""MM""DD"-"YYYY""MM"-"MM""DD"-"DD'
    )

    # regular postgres format
    assert parse_c_standard_code_to_postgres_code('YYYYMMDD') == '"YYYYMMDD"'

    assert len(recwarn) == 2


# https://docs.pytest.org/en/6.2.x/warnings.html#:~:text=The%20recwarn%20fixture%20will,assert%20w.lineno
def test_parse_c_standard_code_to_postgres_code_warning(recwarn):
    parse_c_standard_code_to_postgres_code('%Y-%m-%s-%d %t %g%%%')
    assert len(recwarn) == 1
    result = recwarn[0]
    assert issubclass(result.category, UserWarning)
    assert str(result.message) == "There are no equivalent codes for ['%%', '%s', '%t']."


def test_parse_c_code_to_bigquery_code(recwarn):
    assert parse_c_code_to_bigquery_code('%H:%M:%S.%f') == '%H:%M:%E6S'
    assert parse_c_code_to_bigquery_code('%H:%M:%S.%f %f %S.%f') == '%H:%M:%E6S %f %E6S'
    assert len(recwarn) == 1
    result = recwarn[0]
    assert issubclass(result.category, UserWarning)
    assert str(result.message) == "There are no equivalent codes for %f."


def test_parse_c_code_to_athena_code(recwarn):
    assert parse_c_code_to_athena_code('%Y-%m-%d') == '%Y-%m-%d'
    assert parse_c_code_to_athena_code('%M-%B') == '%i-%M'
    # Escape not supported codes:
    assert parse_c_code_to_athena_code('%V') == '%%V'
    assert parse_c_code_to_athena_code('%q %1 %_') == '%%q %%1 %%_'
    # Handle double quotes correctly
    assert parse_c_code_to_athena_code('%%%m') == '%%%m'
    assert len(recwarn) == 0
