"""
Copyright 2022 Objectiv B.V.
"""
from typing import Dict, Tuple, Mapping

from sqlalchemy.engine import Engine

from bach.expression import Expression, join_expressions
from bach.types import get_dtype_from_db_dtype, StructuredDtype
from bach.utils import escape_parameter_characters
from sql_models.constants import DBDialect
from sql_models.model import SqlModel, CustomSqlModelBuilder
from sql_models.sql_generator import to_sql
from sql_models.util import is_postgres, DatabaseNotSupportedException, is_bigquery, is_athena


def get_dtypes_from_model(
        engine: Engine,
        node: SqlModel,
        name_to_column_mapping: Mapping[str, str]
) -> Dict[str, StructuredDtype]:
    """
    Create a temporary database table from model and use it to deduce the model's dtypes.

    Does not support all database engines.

    :return: Dictionary with as key the column names, and as values the dtype of the column.
    """
    if not is_postgres(engine):
        message_override = f'We cannot automatically derive dtypes from a SqlModel for database ' \
                           f'dialect "{engine.name}".'
        raise DatabaseNotSupportedException(engine, message_override=message_override)
    new_node = CustomSqlModelBuilder(sql='select * from {{previous}} limit 0')(previous=node)
    select_statement = to_sql(dialect=engine.dialect, model=new_node)
    sql = f"""
        create temporary table tmp_table_name on commit drop as
        ({select_statement});
        select column_name, data_type
        from information_schema.columns
        where table_name = 'tmp_table_name'
        order by ordinal_position;
    """
    return _get_dtypes_from_information_schema_query(
        engine=engine,
        query=sql,
        name_to_column_mapping=name_to_column_mapping
    )


def get_dtypes_from_table(
    engine: Engine,
    table_name: str,
    name_to_column_mapping: Mapping[str, str]
) -> Dict[str, StructuredDtype]:
    """
    Query database to get dtypes of the given table.
    :param engine: sqlalchemy engine for the database.
    :param table_name: the table name for which to get the dtypes. Can include project_id and dataset on
        BigQuery, e.g. 'project_id.dataset.table_name'
    :param name_to_column_mapping: Mapping from series-name to column-names. The names in the
        returned dictionary will be reverse mapped with this mapping. If incomplete, the table's column names
        will be assumed to be the series-names.
    :return: Dictionary with as key the series names, and as values the dtype of the matching column.
    """
    filters_expr = []
    if is_postgres(engine):
        meta_data_table = 'INFORMATION_SCHEMA.COLUMNS'
    elif is_bigquery(engine):
        meta_data_table, table_name = _get_bq_meta_data_table_from_table_name(table_name)
    elif is_athena(engine):
        catalog_name = (
            f"{engine.url.query['catalog_name']}." if 'catalog_name' in engine.url.query else ''
        )
        meta_data_table = f'{catalog_name}INFORMATION_SCHEMA.COLUMNS'
        # This filter is needed because athena does not limit to data from the current schema
        filters_expr.append(Expression.construct(f"table_schema='{engine.url.database}'"))
    else:
        raise DatabaseNotSupportedException(engine)

    filters_expr.append(Expression.construct(f"table_name='{table_name}'"))
    filters_stmt = join_expressions(filters_expr, join_str=' AND ').to_sql(engine.dialect)
    sql = f"""
        select column_name, data_type
        from {meta_data_table}
        where {filters_stmt}
        order by ordinal_position;
    """
    return _get_dtypes_from_information_schema_query(
        engine=engine,
        query=sql,
        name_to_column_mapping=name_to_column_mapping
    )


def _get_bq_meta_data_table_from_table_name(table_name) -> Tuple[str, str]:
    """
    From a BigQuery table name, get the meta-data table name that contains the column information for that
    table, and the short table name.
    Examples:
        'project_id.dataset.table1' -> ('project_id.dataset.INFORMATION_SCHEMA.COLUMNS', 'table1')
        'table1' -> ('INFORMATION_SCHEMA.COLUMNS', 'table1')
    :param table_name: a table name, a table name including dataset or including project_id and dataset
    :return: a tuple: the metadata table containing column information, the simple table name
    """
    parts = table_name.rsplit('.', maxsplit=1)
    if len(parts) == 2:
        project_id_dataset = parts[0] + '.'
        table_name = parts[1]
    else:
        project_id_dataset = ''
        table_name = parts[0]
    return f'{project_id_dataset}INFORMATION_SCHEMA.COLUMNS', table_name


def _get_dtypes_from_information_schema_query(
        engine: Engine,
        query: str,
        name_to_column_mapping: Mapping[str, str]
) -> Dict[str, StructuredDtype]:
    """
    Execute query and parse information_schema.columns data to a dictionary mapping Series-names to dtypes.

    If name_to_column_mapping is incomplete, the column names that the query renders will be assumed to be
    series-names.
    """
    column_to_name_mapping = {column: name for name, column in name_to_column_mapping.items()}
    with engine.connect() as conn:
        sql = escape_parameter_characters(conn, query)
        res = conn.execute(sql)
        rows = res.fetchall()

    db_dialect = DBDialect.from_engine(engine)
    result = {}
    for row in rows:
        column_name, db_dtype = row
        series_name = column_to_name_mapping.get(column_name, column_name)
        result[series_name] = get_dtype_from_db_dtype(db_dialect, db_dtype)
    return result
