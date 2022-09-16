import uuid
from copy import copy
from decimal import Decimal
from typing import List, Union, Any

import pandas as pd
from sqlalchemy.engine import Engine

from bach import DataFrame, Series
from sql_models.util import is_postgres, is_bigquery, is_athena


def _get_view_sql_data(df: DataFrame):
    sql = df.view_sql()
    # escape sql, as conn.execute will think that '%' indicates a parameter
    sql = sql.replace('%', '%%')
    with df.engine.connect() as conn:
        db_rows = conn.execute(sql)

    column_names = list(db_rows.keys())
    db_values = [list(row) for row in db_rows]
    print(db_values)
    return column_names, db_values


def _get_to_pandas_data(df: DataFrame):
    pdf = df.to_pandas()
    # Convert pdf to the same format as _get_view_sql_data gives
    column_names = (list(pdf.index.names) if df.index else []) + list(pdf.columns)
    pdf = pdf.reset_index()
    db_values = []
    for value_row in pdf.to_numpy().tolist():
        db_values.append(value_row if df.index else value_row[1:])  # don't include default index value
    print(db_values)
    return column_names, db_values


def _convert_uuid_expected_data(engine: Engine, data: List[List[Any]]) -> List[List[Any]]:
    """
    Convert any UUID objects in data to string, if we represent uuids with strings in the engine's dialect.
    """
    if is_postgres(engine):
        return data
    if is_athena(engine) or is_bigquery(engine):
        result = [
            [str(cell) if isinstance(cell, uuid.UUID) else cell for cell in row]
            for row in data
        ]
        return result
    raise Exception(f'engine not supported {engine}')


def assert_equals_data(
    bt: Union[DataFrame, Series],
    expected_columns: List[str],
    expected_data: List[list],
    order_by: Union[str, List[str]] = None,
    use_to_pandas: bool = False,
    round_decimals: bool = False,
    decimal=4,
    convert_uuid: bool = False,
) -> List[List[Any]]:
    """
    Execute the sql of ButTuhDataFrame/Series's view_sql(), with the given order_by, and make sure the
    result matches the expected columns and data.

    Note: By default this does not call `to_pandas()`, which we nowadays consider our 'normal' path,
    but directly executes the result from `view_sql()`. To test `to_pandas()` set use_to_pandas=True.
    :return: the values queried from the database
    """
    if len(expected_data) == 0:
        raise ValueError("Cannot check data if 0 rows are expected.")

    if isinstance(bt, Series):
        # Otherwise sorting does not work as expected
        bt = bt.to_frame()

    if convert_uuid:
        expected_data = _convert_uuid_expected_data(bt.engine, expected_data)

    if order_by:
        bt = bt.sort_values(order_by)
    elif not bt.order_by:
        bt = bt.sort_index()

    if not use_to_pandas:
        column_names, db_values = _get_view_sql_data(bt)
    else:
        column_names, db_values = _get_to_pandas_data(bt)

    assert len(db_values) == len(expected_data)
    assert column_names == expected_columns

    _date_freq = 'ms' if is_athena(bt.engine) else 'us'
    for i, df_row in enumerate(db_values):
        expected_row = expected_data[i]
        assert len(df_row) == len(expected_row)
        for j, val in enumerate(df_row):
            actual = copy(val)
            expected = copy(expected_row[j])

            if isinstance(val, (float, Decimal)) and round_decimals:
                actual = round(Decimal(actual), decimal)
                expected = round(Decimal(expected), decimal)

            if isinstance(actual, pd.Timestamp):
                pdt_expected = pd.Timestamp(expected, tz=None)
                actual = actual.floor(freq=_date_freq)
                expected = pdt_expected.floor(freq=_date_freq)

            assert_msg = f'row {i} is not equal: {expected_row} != {df_row}'
            if actual is pd.NaT:
                assert expected is pd.NaT, assert_msg
            else:
                assert actual == expected, assert_msg
    return db_values
