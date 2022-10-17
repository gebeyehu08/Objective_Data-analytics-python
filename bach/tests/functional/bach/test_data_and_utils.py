"""
Copyright 2021 Objectiv B.V.

Utilities and a very simple dataset for testing Bach DataFrames.

This file does not contain any test, but having the file's name start with `test_` makes pytest treat it
as a test file. This makes pytest rewrite the asserts to give clearer errors.
"""
import datetime
from typing import Type, List, Any, Mapping

import sqlalchemy
from sqlalchemy.engine import ResultProxy, Engine, Dialect

from bach import DataFrame, Series
from sql_models.constants import DBDialect
from sql_models.util import is_bigquery, quote_identifier
from tests.unit.bach.util import get_pandas_df
from bach.testing import assert_equals_data

# Three data tables for testing are defined here that can be used in tests
# 1. cities: 3 rows (or 11 for the full dataset) of data on cities
# 2. food: 3 rows of food data
# 3. railways: 7 rows of data on railway stations

# cities is the main table and should be used when sufficient. The other tables can be used in addition
# for more complex scenarios (e.g. merging)
ROW_LIMIT = 3
TEST_DATA_CITIES_FULL = [
    [1, 'Ljouwert', 'Leeuwarden', 93485, 1285],
    [2, 'Snits', 'Súdwest-Fryslân', 33520, 1456],
    [3, 'Drylts', 'Súdwest-Fryslân', 3055, 1268],
    [4, 'Sleat', 'De Friese Meren', 700, 1426],
    [5, 'Starum', 'Súdwest-Fryslân', 960, 1061],
    [6, 'Hylpen', 'Súdwest-Fryslân', 870, 1225],
    [7, 'Warkum', 'Súdwest-Fryslân', 4440, 1399],
    [8, 'Boalsert', 'Súdwest-Fryslân', 10120, 1455],
    [9, 'Harns', 'Harlingen', 14740, 1234],
    [10, 'Frjentsjer', 'Waadhoeke', 12760, 1374],
    [11, 'Dokkum', 'Noardeast-Fryslân', 12675, 1298],
]
# The TEST_DATA set that we'll use in most tests is limited to 3 rows for convenience.
TEST_DATA_CITIES = TEST_DATA_CITIES_FULL[:ROW_LIMIT]
CITIES_COLUMNS_X_DTYPES = {
    'skating_order': 'int64',
    'city': 'string',
    'municipality': 'string',
    'inhabitants': 'int64',
    'founding': 'int64'
}
CITIES_COLUMNS = list(CITIES_COLUMNS_X_DTYPES.keys())
# The default dataframe has skating_order as index, so that column will be prepended before the actual
# data in the query results.
CITIES_INDEX_AND_COLUMNS = ['_index_skating_order'] + CITIES_COLUMNS

TEST_DATA_FOOD = [
    [1, 'Sûkerbôlle', '2021-05-03 11:28:36.388', '2021-05-03'],
    [2, 'Dúmkes', '2021-05-04 23:28:36.388', '2021-05-04'],
    [4, 'Grutte Pier Bier', '2022-05-03 14:13:13.388', '2022-05-03']
]
FOOD_COLUMNS_X_DTYPES = {
    'skating_order': 'int64',
    'food': 'string',
    'moment': 'timestamp',
    'date': 'date',
}
FOOD_COLUMNS = list(FOOD_COLUMNS_X_DTYPES.keys())
FOOD_INDEX_AND_COLUMNS = ['_index_skating_order'] + FOOD_COLUMNS

TEST_DATA_RAILWAYS = [
    [1, 'Drylts', 'IJlst', 1],
    [2, 'It Hearrenfean', 'Heerenveen', 1],
    [3, 'It Hearrenfean', 'Heerenveen IJsstadion', 2],
    [4, 'Ljouwert', 'Leeuwarden', 4],
    [5, 'Ljouwert', 'Camminghaburen', 1],
    [6, 'Snits', 'Sneek', 2],
    [7, 'Snits', 'Sneek Noord', 2],
]
RAILWAYS_COLUMNS_X_DTYPES = {
    'station_id': 'int64',
    'town': 'string',
    'station': 'string',
    'platforms': 'int64',
}
RAILWAYS_COLUMNS = list(RAILWAYS_COLUMNS_X_DTYPES.keys())
RAILWAYS_INDEX_AND_COLUMNS = ['_index_station_id'] + RAILWAYS_COLUMNS

TEST_DATA_JSON = [
    [0,
     '{"a": "b"}',
     '[{"a": "b"}, {"c": "d"}]',
     '{"a": "b"}'
     ],
    [1,
     '{"_type": "SectionContext", "id": "home"}',
     '["a","b","c","d"]',
     '["a","b","c","d"]'
     ],
    [2,
     '{"a": "b", "c": {"a": "c"}}',
     '[{"_type": "a", "id": "b"},{"_type": "c", "id": "d"},{"_type": "e", "id": "f"}]',
     '{"a": "b", "c": {"a": "c"}}'
     ],
    [3,
     '{"a": "b", "e": [{"a": "b"}, {"c": "d"}]}',
     '[{"_type":"WebDocumentContext","id":"#document"},'
     ' {"_type":"SectionContext","id":"home"},'
     ' {"_type":"SectionContext","id":"top-10"},'
     ' {"_type":"ItemContext","id":"5o7Wv5Q5ZE"}]',
     '[{"_type":"WebDocumentContext","id":"#document"},'
     ' {"_type":"SectionContext","id":"home"},'
     ' {"_type":"SectionContext","id":"top-10"},'
     ' {"_type":"ItemContext","id":"5o7Wv5Q5ZE"}]'
     ],
    [4,
     None,
     None,
     None
     ],
]
JSON_COLUMNS = ['row', 'dict_column', 'list_column', 'mixed_column']
JSON_INDEX_AND_COLUMNS = ['_row_id'] + JSON_COLUMNS


def get_df_with_test_data(engine: Engine, full_data_set: bool = False) -> DataFrame:
    dataset = TEST_DATA_CITIES_FULL if full_data_set else TEST_DATA_CITIES
    return DataFrame.from_pandas(
        engine=engine,
        df=get_pandas_df(dataset, CITIES_COLUMNS),
        convert_objects=True
    )


def get_df_with_food_data(engine: Engine) -> DataFrame:
    return DataFrame.from_pandas(
        engine=engine,
        df=get_pandas_df(TEST_DATA_FOOD, FOOD_COLUMNS),
        convert_objects=True,
    )


def get_df_with_railway_data(engine: Engine) -> DataFrame:
    return DataFrame.from_pandas(
        engine=engine,
        df=get_pandas_df(TEST_DATA_RAILWAYS, RAILWAYS_COLUMNS),
        convert_objects=True,
    )


def get_df_with_json_data(engine: Engine, dtype='json') -> DataFrame:
    assert dtype in ('string', 'json', 'json_postgres')
    df = DataFrame.from_pandas(
        engine=engine,
        df=get_pandas_df(TEST_DATA_JSON, JSON_COLUMNS),
        convert_objects=True,
    )
    if dtype:
        df['dict_column'] = df.dict_column.astype(dtype)
        df['list_column'] = df.list_column.astype(dtype)
        df['mixed_column'] = df.mixed_column.astype(dtype)
    return df.materialize()


def run_query(engine: sqlalchemy.engine, sql: str) -> ResultProxy:
    # escape sql, as conn.execute will think that '%' indicates a parameter
    sql = sql.replace('%', '%%')
    with engine.connect() as conn:
        res = conn.execute(sql)
        return res


def df_to_list(df):
    data_list = df.reset_index().to_numpy().tolist()
    return(data_list)


def assert_series_db_types(
        df: DataFrame,
        expected_series: Mapping[str, Type[Series]],
        expected_db_type_overrides: Mapping[DBDialect, Mapping[str, str]] = None
):
    """
    Check that in the given DataFrame, all of the expected_series:
     1) have the expected Series subtype in the DataFrame.
     2) have the expected data type in the database.

    If the expected data-type in the database is non-standard for that Series subtype (e.g. 'varchar(4)'
    instead of just 'varchar'), then that can be overriden with the expected_db_type_overrides.

    :param df: DataFrame object for which to check the database types
    :param expected_series: Per series-name, the expected Series subtype
    :param expected_db_type_overrides: Per database dialect a mapping of series-names to database types. That
        override the default expected database type.
    """
    expected_db_type_overrides = {} if expected_db_type_overrides is None else expected_db_type_overrides

    db_dialect = DBDialect.from_engine(df.engine)
    expected_db_types_dialect = {}
    for series_name, series_type in expected_series.items():
        assert isinstance(df[series_name], series_type)

        type_override = expected_db_type_overrides.get(db_dialect, {}).get(series_name)
        if type_override is not None:
            expected_db_types_dialect[series_name] = type_override
        else:
            expected_db_types_dialect[series_name] = series_type.get_db_dtype(dialect=df.engine.dialect)
    expected_db_types = {db_dialect: expected_db_types_dialect}
    assert_db_types(df=df, expected_db_types=expected_db_types)


def assert_db_types(
        df: DataFrame,
        expected_db_types: Mapping[DBDialect, Mapping[str, str]]
):
    """
    Check that the given series in the DataFrame have the expected data types in the database.

    :param df: DataFrame object for which to check the database types
    :param expected_db_types: Per database dialect a mapping of series-names to database types.
        Must at least contain a mapping from series-name to expected database types for the db-dialect of
        df.engine
    """
    engine = df.engine
    db_dialect = DBDialect.from_engine(engine)
    if db_dialect not in expected_db_types:
        raise Exception(f'db dialect "{db_dialect.name}" not in expected_db_types.')
    db_expected_db_types = expected_db_types[db_dialect]

    typeof_function_name = {
        DBDialect.POSTGRES: 'pg_typeof',
        DBDialect.ATHENA: 'typeof',
        # `bqutil.fn.typeof` is not a default BQ function, but a community function that's available to all.
        # https://github.com/GoogleCloudPlatform/bigquery-utils/tree/master/udfs/community#typeofinput-any-type
        DBDialect.BIGQUERY: 'bqutil.fn.typeof',
    }[db_dialect]

    df_sql = df.view_sql()
    types_sql = ', '.join(
        f'{typeof_function_name}({quote_identifier(dialect=engine.dialect, name=series_name)})'
        for series_name in db_expected_db_types.keys()
    )
    sql = f'with check_type as ({df_sql}) select {types_sql} from check_type limit 1'
    db_rows = run_query(engine=engine, sql=sql)
    db_values = [list(row) for row in db_rows]
    for i, series_name in enumerate(db_expected_db_types.keys()):
        expected_db_type = db_expected_db_types[series_name]
        db_type = db_values[0][i]
        msg = f"expected type {expected_db_type} for {series_name}, found {db_type}"
        assert db_type == expected_db_type, msg


def convert_expected_data_timestamps(dialect: Dialect, data: List[List[Any]]) -> List[List[Any]]:
    """ Set UTC timezone on datetime objects if dialect is BigQuery. """
    def set_tz(value):
        if not isinstance(value, (datetime.datetime, datetime.date)) or not is_bigquery(dialect):
            return value
        return value.replace(tzinfo=datetime.timezone.utc)
    return [[set_tz(cell) for cell in row] for row in data]
