"""
Copyright 2021 Objectiv B.V.
"""
import pytest
from sqlalchemy.engine import Engine

from sql_models.util import is_bigquery, is_athena
from tests.functional.bach.test_data_and_utils import assert_equals_data, get_df_with_test_data


def test_column_names(engine):
    # Athena and BigQuery don't allow 'weird' characters, so we just expect an error about the names.
    if is_athena(engine) or is_bigquery(engine):
        with pytest.raises(ValueError, match='Column name ".*" is not valid for SQL dialect'):
            bt = _get_dataframe_with_weird_column_names(engine)
        return
    # Postgres does allow 'weird' characters, if properly escaped. Test the escaping
    bt = _get_dataframe_with_weird_column_names(engine)
    expected_columns = ['_index_skating_order',
                        'city',
                        'With_And_Without_Capitals', 'with_and_without_capitals',
                        'With A Space Too',
                        '"""with"_quotes""', '```with`_quotes``', "'''with'_quotes''",
                        'with%percentage', 'with{format}{{strings}}{{}',
                        'Aa_!#!$*(aA®Řﬦ‎	⛔']
    expected_data = [
        [1, 'Ljouwert', 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [2, 'Snits', 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [3, 'Drylts', 1, 2, 3, 4, 5, 6, 7, 8, 9]
    ]
    assert_equals_data(
        bt,
        use_to_pandas=True,
        expected_columns=expected_columns,
        expected_data=expected_data
    )

    # Make sure that after materializing the columns are unchanged.
    bt = bt.materialize().sort_index()
    assert_equals_data(
        bt,
        use_to_pandas=True,
        expected_columns=expected_columns,
        expected_data=expected_data
    )


@pytest.mark.skip_bigquery_todo('#1209 We do not yet support special characters in column names on BigQuery')
@pytest.mark.skip_athena_todo('#1209 We do not yet support special characters in column names on Athena')
def test_column_names_merge(engine):
    # When merging we construct a specific sql query that names each column, so test that separately here
    bt = _get_dataframe_with_weird_column_names(engine)
    bt2 = get_df_with_test_data(engine)[['city']]
    bt = bt.merge(bt2, on='city')
    expected_columns = ['_index_skating_order_x', '_index_skating_order_y',
                        'city',
                        'With_And_Without_Capitals', 'with_and_without_capitals',
                        'With A Space Too',
                        '"""with"_quotes""', '```with`_quotes``', "'''with'_quotes''",
                        'with%percentage', 'with{format}{{strings}}{{}',
                        'Aa_!#!$*(aA®Řﬦ‎	⛔']
    expected_data = [
        [1, 1, 'Ljouwert', 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [2, 2, 'Snits', 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [3, 3, 'Drylts', 1, 2, 3, 4, 5, 6, 7, 8, 9]
    ]
    assert_equals_data(
        bt,
        use_to_pandas=True,
        expected_columns=expected_columns,
        expected_data=expected_data
    )


def _get_dataframe_with_weird_column_names(engine: Engine):
    bt = get_df_with_test_data(engine)[['city']]
    # Some database engine have case-insensitive column names. Make sure this doesn't cause problems by
    # having two columns with the same name, but different capitalization
    bt['With_And_Without_Capitals'] = 1
    bt['with_and_without_capitals'] = 2
    # Test proper quoting of column names with spaces.
    bt['With A Space Too'] = 3
    # Test proper encoding of quote characters.
    bt['"""with"_quotes""'] = 4
    bt['```with`_quotes``'] = 5
    bt["'''with'_quotes''"] = 6
    # Test proper encoding of possible formatting and escaping characters.
    bt['with%percentage'] = 7
    bt['with{format}{{strings}}{{}'] = 8
    # Test encoding of non-ascii characters
    bt['Aa_!#!$*(aA®Řﬦ‎	⛔'] = 9
    return bt

# TODO: tests for groupby and windowing
