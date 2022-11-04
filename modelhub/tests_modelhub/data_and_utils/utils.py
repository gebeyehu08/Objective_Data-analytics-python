from enum import Enum
from typing import Dict, Any, NamedTuple, Optional

import bach
import pandas as pd
from sql_models.constants import DBDialect
from sql_models.util import is_postgres
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from tests_modelhub.data_and_utils.data_json_real import TEST_DATA_JSON_REAL, JSON_COLUMNS_REAL


class DBParams(NamedTuple):
    class Format(Enum):
        # native objectiv format, currently only in PG
        OBJECTIV = 'objectiv'
        # snowplow's native format, using Iglu contexts to store objectiv specific data
        SNOWPLOW = 'snowplow'
        FLATTENED_SNOWPLOW = 'flattened_snowplow'

    url: str
    credentials: Optional[str]
    table_name: str
    format: Format


def get_df_with_json_data_real(db_params: DBParams) -> bach.DataFrame:
    engine = create_engine_from_db_params(db_params)
    pdf = pd.DataFrame.from_records(TEST_DATA_JSON_REAL, columns=JSON_COLUMNS_REAL)
    pdf.set_index(pdf.columns[0], drop=False, inplace=True)

    df = bach.DataFrame.from_pandas(engine=engine, df=pdf)
    df['global_contexts'] = df.global_contexts.astype('json')
    df['location_stack'] = df.location_stack.astype('json')
    return df

def create_engine_from_db_params(db_params: DBParams) -> Engine:
    if db_params.credentials:
        engine = create_engine(url=db_params.url, credentials_path=db_params.credentials)
    else:
        engine = create_engine(url=db_params.url)

    return engine


def setup_db(engine: Engine, table_name: str):
    columns = {
        'event_id': bach.SeriesUuid.supported_db_dtype[DBDialect.POSTGRES],
        'day': bach.SeriesDate.supported_db_dtype[DBDialect.POSTGRES],
        'moment': bach.SeriesTimestamp.supported_db_dtype[DBDialect.POSTGRES],
        'cookie_id': bach.SeriesUuid.supported_db_dtype[DBDialect.POSTGRES],
        'value': bach.SeriesJson.supported_db_dtype[DBDialect.POSTGRES],
    }
    _prep_db_table(engine, table_name=table_name, columns=columns)
    _insert_records_in_db(engine, table_name=table_name, columns=columns)


def _run_query(engine: Engine, sql: str):
    sql = sql.replace('%', '%%')
    with engine.connect() as conn:
        res = conn.execute(sql)
        return res


def _prep_db_table(engine, table_name: str, columns: Dict[str, Any]):
    if is_postgres(engine):
        column_stmt = ','.join(f'{col_name} {db_type}' for col_name, db_type in columns.items())
        sql = f"""
            drop table if exists {table_name};
            create table {table_name} ({column_stmt});
            alter table {table_name}
                owner to objectiv
        """
    else:
        raise Exception()
    _run_query(engine, sql)


def _insert_records_in_db(engine, table_name: str, columns: Dict[str, Any]):
    from tests_modelhub.data_and_utils.data_objectiv import TEST_DATA_OBJECTIV

    column_stmt = ','.join(columns.keys())
    records = []
    if is_postgres(engine):
        for record in TEST_DATA_OBJECTIV:
            formatted_values = [f"'{record[col_index]}'" for col_index, _ in enumerate(columns)]
            records.append(f"({','.join(formatted_values)})")
    else:
        raise Exception()

    values_stmt = ','.join(records)
    sql = f'insert into {table_name} ({column_stmt}) values {values_stmt}'
    return _run_query(engine, sql)
