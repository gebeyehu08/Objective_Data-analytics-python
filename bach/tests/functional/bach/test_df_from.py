"""
Copyright 2022 Objectiv B.V.

tests for:
 * DataFrame.from_table()
 * DataFrame.from_model()

"""
from datetime import date, datetime

import pytest
from sqlalchemy.engine import Engine

from bach import DataFrame
from bach.utils import merge_sql_statements
from sql_models.constants import DBDialect
from sql_models.model import CustomSqlModelBuilder, SqlModel, Materialization
from sql_models.sql_generator import to_sql
from sql_models.util import is_athena
from tests.conftest import DB_ATHENA_LOCATION
from tests.functional.bach.test_data_and_utils import assert_equals_data


def _create_test_table(engine: Engine, table_name: str, add_data: bool):
    all_sql_strings = {
        DBDialect.POSTGRES: f'''
                drop table if exists {table_name};
                create table {table_name}(
                    a bigint,
                    b text,
                    c double precision,
                    d date,
                    e timestamp,
                    "F" boolean
                );

                insert into {table_name}(a, b, c, d, e, "F") values
                (123, 'test', 1.2345, '2022-01-01', '2000-03-04 05:43:21', true);
            ''',
        # Note that for Athena we have the `F` column, but it is created by Athena as lower-case `f` [1].
        # Verified this in the web-interface, the actual column-name is lower-case there too.
        # [1] https://docs.aws.amazon.com/athena/latest/ug/tables-databases-columns-names.html
        DBDialect.ATHENA: f'''
                drop table if exists {table_name};
                create external table {table_name}(
                    a bigint,
                    b string,
                    c double,
                    d date,
                    e timestamp,
                    `F` boolean
                )
                location '{DB_ATHENA_LOCATION}/{table_name}/';

                insert into {table_name}(a, b, c, d, e, "F") values
                (123, 'test', 1.2345, DATE '2022-01-01', TIMESTAMP '2000-03-04 05:43:21', true);
            ''',
        DBDialect.BIGQUERY: f'''
                drop table if exists {table_name};
                create table {table_name}(
                    a int64,
                    b string,
                    c float64,
                    d date,
                    e timestamp,
                    `F` bool
                );

                insert into {table_name}(a, b, c, d, e, `F`) values
                (123, 'test', 1.2345, '2022-01-01', '2000-03-04 05:43:21', true);
            '''
    }
    sql_strings = all_sql_strings[DBDialect.from_engine(engine)]
    sql_statements = [s for s in sql_strings.split(';') if s.strip()]
    assert len(sql_statements) == 3

    if not add_data:  # Only keep the 'drop table' and 'create table' statements. This saves a query.
        sql_statements = sql_statements[:2]

    sql_statements = merge_sql_statements(dialect=engine.dialect, sql_statements=sql_statements)

    with engine.connect() as conn:
        for sql_statement in sql_statements:
            conn.execute(sql_statement)


@pytest.mark.skip_postgres
@pytest.mark.skip_athena
def test_from_table_structural_big_query(engine, unique_table_test_name):
    # Test specifically for structural types on BigQuery. We don't support that on Postgres, so we skip
    # postgres for this test
    table_name = unique_table_test_name
    sql = f'drop table if exists {table_name}; ' \
          f'create table {table_name}(' \
          f'a INT64, ' \
          f'b STRUCT<f1 INT64, f2 FLOAT64, f3 STRUCT<f31 ARRAY<INT64>, f32 BOOL>>, ' \
          f'c ARRAY<STRUCT<f1 INT64, f2 INT64>>);'
    with engine.connect() as conn:
        conn.execute(sql)

    df = DataFrame.from_table(engine=engine, table_name=table_name, index=['a'])
    assert df.index_dtypes == {'a': 'int64'}
    assert df.dtypes == {'b': 'dict', 'c': 'list'}
    assert df.is_materialized
    assert df.base_node.series_names == ('a', 'b', 'c')
    assert df['b'].instance_dtype == {'f1': 'int64', 'f2': 'float64', 'f3': {'f31': ['int64'], 'f32': 'bool'}}
    assert df['c'].instance_dtype == [{'f1': 'int64', 'f2': 'int64'}]


def test_from_table_basic(engine, unique_table_test_name):
    table_name = unique_table_test_name
    _create_test_table(engine, table_name, add_data=True)

    df = DataFrame.from_table(engine=engine, table_name=table_name, index=['a'])
    expected_dtypes = {'b': 'string', 'c': 'float64', 'd': 'date', 'e': 'timestamp', 'F': 'bool'}
    expected_base_node_columns = ('a', 'b', 'c', 'd', 'e', 'F')
    if is_athena(engine):  # Athena automatically lower-cases capital letters in column-names of tables.
        expected_dtypes = {'b': 'string', 'c': 'float64', 'd': 'date', 'e': 'timestamp', 'f': 'bool'}
        expected_base_node_columns = ('a', 'b', 'c', 'd', 'e', 'f')

    assert df.index_dtypes == {'a': 'int64'}
    assert df.dtypes == expected_dtypes
    assert df.is_materialized
    assert df.base_node.series_names == expected_base_node_columns
    # there should only be a single model that selects from the table, not a whole tree
    assert df.base_node.materialization == Materialization.SOURCE
    with pytest.raises(Exception, match="No models to compile"):
        to_sql(dialect=engine.dialect, model=df.base_node)
    assert df.base_node.references == {}
    # Now do some basic operations to establish that the DataFrame instance we got is fully functional.
    # All other functional tests that we have use a CTE as base data. So this is the only place where we
    # actually test functionality of table-based DataFrames.
    _assert_df_supports_basic_operations(df)

    # now create same DataFrame, but specify all_dtypes.
    all_dtypes = {'a': 'int64', 'b': 'string', 'c': 'float64', 'd': 'date', 'e': 'timestamp', 'F': 'bool'}
    if is_athena(engine):
        all_dtypes = {k.lower(): v for k, v in all_dtypes.items()}
    df_all_dtypes = DataFrame.from_table(
        engine=engine, table_name=table_name, index=['a'],
        all_dtypes=all_dtypes
    )
    assert df == df_all_dtypes


def _assert_df_supports_basic_operations(df: DataFrame):
    """
    Helper for test_from_table_basic() and test_from_model_basic(). Does some basic operations, and asserts
    we get the expected output.
    :param df: DataFrame based on the table as created by `_create_test_table()`.
    """
    df = df.copy()
    df_original = df.copy()
    df['b'] = df['b'] + '-test'
    df['c'] = df['c'] + 100
    df = df.append(df)
    df = df.sort_index()
    df = df.merge(df_original, on=['a'])

    expected_columns = ['a', 'b_x', 'c_x', 'd_x', 'e_x', 'F_x', 'b_y', 'c_y', 'd_y', 'e_y', 'F_y']
    if is_athena(df.engine):
        # Athena automatically lower-cases capital letters in column-names of tables [1].
        expected_columns = [name.lower() for name in expected_columns]
    assert_equals_data(
        df,
        use_to_pandas=True,
        expected_columns=expected_columns,
        expected_data=[
            [123, 'test-test', 101.2345, date(2022, 1, 1), datetime(2000, 3, 4, 5, 43, 21), True,
             'test', 1.2345, date(2022, 1, 1), datetime(2000, 3, 4, 5, 43, 21), True],
            [123, 'test-test', 101.2345, date(2022, 1, 1), datetime(2000, 3, 4, 5, 43, 21), True,
             'test', 1.2345, date(2022, 1, 1), datetime(2000, 3, 4, 5, 43, 21), True]
        ]
    )


@pytest.mark.skip_bigquery_todo('https://github.com/objectiv/objectiv-analytics/issues/1375')
@pytest.mark.skip_athena_todo('https://github.com/objectiv/objectiv-analytics/issues/1375')
def test_from_model_basic(engine, unique_table_test_name):
    # This is essentially the same test as test_from_table_basic(), but tests creating the dataframe with
    # from_model instead of from_table
    table_name = unique_table_test_name
    _create_test_table(engine, table_name, add_data=True)
    sql_model: SqlModel = CustomSqlModelBuilder(sql=f'select * from {table_name}')()

    df = DataFrame.from_model(engine=engine, model=sql_model, index=['a'])
    assert df.index_dtypes == {'a': 'int64'}
    assert df.dtypes == {'b': 'string', 'c': 'float64', 'd': 'date', 'e': 'timestamp', 'F': 'bool'}
    assert df.is_materialized
    assert df.base_node.series_names == ('a', 'b', 'c', 'd', 'e', 'F')
    # there should only be a single model that selects from the table, not a whole tree
    assert df.base_node.references == {}
    # Now do some basic operations to establish that the DataFrame instance we got is fully functional.
    # All other functional tests that we have use a CTE as base data. So this is the only place where we
    # actually test functionality of sqlmodel-based DataFrames.
    _assert_df_supports_basic_operations(df)

    # now create same DataFrame, but specify all_dtypes.
    df_all_dtypes = DataFrame.from_model(
        engine=engine, model=sql_model, index=['a'],
        all_dtypes={'a': 'int64', 'b': 'string', 'c': 'float64', 'd': 'date', 'e': 'timestamp', 'F': 'bool'}
    )
    assert df == df_all_dtypes


def test_from_table_column_ordering(engine, unique_table_test_name):
    # Create a Dataframe in which the index is not the first column in the table.
    table_name = unique_table_test_name
    _create_test_table(engine, table_name, add_data=False)

    df = DataFrame.from_table(engine=engine, table_name=table_name, index=['b'])

    expected_dtypes = {'a': 'int64', 'c': 'float64', 'd': 'date', 'e': 'timestamp', 'F': 'bool'}
    expected_base_node_columns = ('b', 'a', 'c', 'd', 'e', 'F')
    if is_athena(engine):  # Athena automatically lower-cases capital letters in column-names of tables.
        expected_dtypes = {k.lower(): v for k, v in expected_dtypes.items()}
        expected_base_node_columns = tuple(n.lower() for n in expected_base_node_columns)

    assert df.index_dtypes == {'b': 'string'}
    assert df.dtypes == expected_dtypes
    assert df.is_materialized
    # We should have an extra model in the sql-model graph, because 'b' is the index and should thus be the
    # first column.
    assert df.base_node.series_names == expected_base_node_columns
    assert 'prev' in df.base_node.references
    assert df.base_node.references['prev'].references == {}
    df.to_pandas()  # test that the main function works on the created DataFrame

    all_dtypes = {'a': 'int64', 'b': 'string', 'c': 'float64', 'd': 'date', 'e': 'timestamp', 'F': 'bool'}
    if is_athena(engine):
        all_dtypes = {k.lower(): v for k, v in all_dtypes.items()}
    df_all_dtypes = DataFrame.from_table(
        engine=engine, table_name=table_name, index=['b'],
        all_dtypes=all_dtypes
    )
    assert df == df_all_dtypes


@pytest.mark.skip_bigquery_todo('https://github.com/objectiv/objectiv-analytics/issues/1375')
@pytest.mark.skip_athena_todo('https://github.com/objectiv/objectiv-analytics/issues/1375')
def test_from_model_column_ordering(engine, unique_table_test_name):
    # This is essentially the same test as test_from_table_model_ordering(), but tests creating the dataframe with
    # from_model instead of from_table

    # Create a Dataframe in which the index is not the first column in the table.
    table_name = unique_table_test_name
    _create_test_table(engine, table_name, add_data=False)
    sql_model: SqlModel = CustomSqlModelBuilder(sql=f'select * from {table_name}')()

    df = DataFrame.from_model(engine=engine, model=sql_model, index=['b'])
    assert df.index_dtypes == {'b': 'string'}
    assert df.dtypes == {'a': 'int64', 'c': 'float64', 'd': 'date', 'e': 'timestamp', 'F': 'bool'}
    assert df.is_materialized
    # We should have an extra model in the sql-model graph, because 'b' is the index and should thus be the
    # first column.
    assert df.base_node.series_names == ('b', 'a', 'c', 'd', 'e', 'F')
    assert 'prev' in df.base_node.references
    assert df.base_node.references['prev'].references == {}
    df.to_pandas()  # test that the main function works on the created DataFrame

    df_all_dtypes = DataFrame.from_model(
        engine=engine, model=sql_model, index=['b'],
        all_dtypes={'a': 'int64', 'b': 'string', 'c': 'float64', 'd': 'date', 'e': 'timestamp', 'F': 'bool'}
    )
    assert df == df_all_dtypes


def test_from_table_column_mapping(engine, unique_table_test_name):
    table_name = unique_table_test_name
    _create_test_table(engine, table_name, add_data=True)

    name_to_column_mapping = {
        'A': 'a',
        '~!@#$%': 'b',
        '__x': 'c',
        'd': 'd',
        'ヽ(。_°)ノ': 'e',
        'f': 'F'
    }

    df = DataFrame.from_table(
        engine=engine,
        table_name=table_name,
        index=['A'],
        name_to_column_mapping=name_to_column_mapping
    )
    expected_dtypes = {
        '~!@#$%': 'string',
        '__x': 'float64',
        'd': 'date',
        'ヽ(。_°)ノ': 'timestamp',
        'f': 'bool'
    }
    expected_base_node_columns = ('A', '~!@#$%', '__x', 'd', 'ヽ(。_°)ノ', 'f')

    assert df.index_dtypes == {'A': 'int64'}
    assert df.dtypes == expected_dtypes
    assert df.is_materialized
    assert df.base_node.series_names == expected_base_node_columns

    # We should have an extra model in the sql-model graph, because the column names don't match the series
    # names, and thus we try to materialize this.
    assert 'prev' in df.base_node.references
    assert df.base_node.references['prev'].references == {}
    assert df.base_node.references['prev'].materialization == Materialization.SOURCE

    # Now do some basic operations to establish that the DataFrame instance we got is fully functional.
    df_original = df.copy()
    df['__x'] = df['__x'] + 100
    assert_equals_data(
        df,
        use_to_pandas=True,
        expected_columns=list(expected_base_node_columns),
        expected_data=[[123, 'test', 101.2345, date(2022, 1, 1), datetime(2000, 3, 4, 5, 43, 21), True]]
    )

    # now create same DataFrame, but specify all_dtypes.
    all_dtypes = {
        'A': 'int64',
        '~!@#$%': 'string',
        '__x': 'float64',
        'd': 'date',
        'ヽ(。_°)ノ': 'timestamp',
        'f': 'bool'
    }
    df_all_dtypes = DataFrame.from_table(
        engine=engine,
        table_name=table_name,
        index=['A'],
        all_dtypes=all_dtypes,
        name_to_column_mapping=name_to_column_mapping
    )
    assert df_original == df_all_dtypes


@pytest.mark.skip_postgres
@pytest.mark.skip_athena
def test_big_query_from_other_project(engine):
    # Test specifically for BigQuery, whether DataFrame.from_table() works on a table in a different project.

    # The selected table is part of Google's BigQuery public datasets.
    # The table in question is about 8 mb, and should never change in size, but still we won't query it to
    # make sure that CI doesn't accidentally incur big costs.
    full_table_name = 'bigquery-public-data.google_analytics_sample.ga_sessions_20170101'
    df = DataFrame.from_table(engine=engine, table_name=full_table_name, index=['visitId'])

    assert df.index_columns == ['visitId']
    assert df.index_dtypes == {'visitId': 'int64'}
    expected_dtypes = {
        'visitorId': 'int64',
        'visitNumber': 'int64',
        'visitStartTime': 'int64',
        'date': 'string',
        'totals': 'dict',
        'trafficSource': 'dict',
        'device': 'dict',
        'geoNetwork': 'dict',
        'customDimensions': 'list',
        'hits': 'list',
        'fullVisitorId': 'string',
        'userId': 'string',
        'channelGrouping': 'string',
        'socialEngagementType': 'string',
    }
    assert df.dtypes == expected_dtypes
    # In this case it's interesting to actually query the table, to verify that that works to across
    # projects.
    # The table is 8 MB in size. At $5 per TB for querying. Running this test 25000 times will cost $1. It
    # seems pretty safe to assume that the table does not magically get bigger, as we'll check the number of
    # rows below.

    # Add a column with the total row count of the table
    df['count'] = df.reset_index()['visitId'].count()
    # subselection of interesting columns
    column_selection = ['count', 'visitorId', 'visitNumber', 'visitStartTime', 'date', 'customDimensions',
                        'fullVisitorId', 'userId', 'channelGrouping', 'socialEngagementType']
    df = df[column_selection]
    df = df.sort_index()
    df = df[0:2]  # 2 rows is plenty

    expected_columns = ['visitId'] + column_selection
    expected_data = [
        [1483257208, 1364, None, 1, 1483257623, '20170101', [{'index': 4, 'value': 'APAC'}], '0736364053634014627', None, 'Direct', 'Not Socially Engaged'],
        [1483257533, 1364, None, 2, 1483257729, '20170101', [{'index': 4, 'value': 'North America'}], '0014884852016449602', None, 'Referral', 'Not Socially Engaged']
    ]
    assert_equals_data(
        df,
        use_to_pandas=True,
        expected_columns=expected_columns,
        expected_data=expected_data
    )
