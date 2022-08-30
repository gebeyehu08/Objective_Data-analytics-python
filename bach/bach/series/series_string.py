"""
Copyright 2021 Objectiv B.V.
"""
import re
from typing import Union, TYPE_CHECKING, Optional, Pattern

from sqlalchemy.engine import Dialect

from bach.partitioning import get_order_by_expression
from bach.series import Series
from bach.expression import Expression, AggregateFunctionExpression, get_variable_tokens, ConstValueExpression
from bach.series.series import WrappedPartition
from bach.types import StructuredDtype
from sql_models.constants import DBDialect
from sql_models.util import DatabaseNotSupportedException, is_bigquery, is_postgres

if TYPE_CHECKING:
    from bach.series import SeriesBoolean, SeriesInt64
    from bach import DataFrame, SortColumn, SeriesJson


class StringOperation:

    def __init__(self, base: 'SeriesString'):
        self._base = base

    def __getitem__(self, key: Union[int, slice]) -> 'SeriesString':
        """
        Get a python string slice using DB functions. Format follows standard slice format
        Note: this is called 'slice' to not destroy index selection logic
        :param key: an int for a single character, or a slice for some nice slicing
        :return: SeriesString with the slice applied
        """
        if key and not isinstance(key, (int, slice)):
            raise ValueError(f'Type not supported {type(key)}')

        start = key.start if isinstance(key, slice) else key

        if isinstance(key, slice):
            stop = key.stop
        else:
            # if key == -1, then we should just return last character, otherwise stop on the next character
            stop = key + 1 if key != -1 else None

        return self._base.copy_override(expression=self._get_substr_expression(start=start, stop=stop))

    def _get_substr_expression(self, start=None, stop=None) -> Expression:
        base_expr = self._base.expression
        len_series = self._base.str.len()

        # just return the full string
        if start is None and stop is None:
            return base_expr

        # normalize start offset, since SQL substr is ordinal
        start_off = 1 if not start else start + 1

        if start_off > 0:
            start_offset_expr = ConstValueExpression.construct(str(start_off))
        elif start_off < 0:
            start_offset_expr = Expression.construct(
                f'({{}} - {abs(start_off)})', len_series
            )
        else:
            # start position is -1
            start_offset_expr = len_series.expression

        # Case 1: no substr length, therefore return all characters after start offset
        if stop is None:
            return Expression.construct('substr({}, {})', base_expr, start_offset_expr)

        stop_off = stop + 1

        # Case 2. Stop Offset is Zero
        # This means we are trying str[x:-1], which is excluding the last char
        if not stop_off:
            return Expression.construct(
                'substr({}, {}, {} - 1)', base_expr, start_offset_expr, len_series,
            )

        # Case 3: Both offsets have the same sign

        if start_off * stop_off > 0:
            # return empty string if start offset is greater or equal to stop_off
            if start_off >= stop_off:
                return Expression.string_value('')

            # stop_off - start_off will always return positive, because stop_off > start_off
            substr_expr = Expression.construct(
                f'substr({{}}, {{}}, {stop_off - start_off})',
                base_expr, start_offset_expr,
            )

            # if both values are negative and start offset exceeds the negative index range,
            # we should return empty string
            if start_off < stop_off < 0:
                substr_expr = Expression.construct(
                    f'CASE WHEN {start_off} > {{}} THEN {{}} ELSE {{}} END',
                    len_series * -1,
                    substr_expr,
                    Expression.string_value('')
                )

            return substr_expr

        # Case 4. Negative Stop Offset and Positive Start Offset
        # This means that we need to get the respective positive index of the stop offset by
        # len(str) - |stop_offset|
        # Where substr length: (len(str) - |stop_offset|) - start_offset > 0

        # for example:
        #
        #          -8  -7  -6  -5  -4  -3  -2  -1
        #           O | B | J | E | C | T | I | V
        #  sql      1   2   3   4   5   6   7   8
        # python    0   1   2   3   4   5   6   7
        #
        # For start == 1 and stop == -6, then the positive stop offset is:  8 - |-6 + 1| = 3
        # and substr length: 3 - (1 + 1) = 1.

        if stop_off < 0:
            substr_len_exp = Expression.construct(
                f'({{}} - {abs(stop_off)}) - {{}}', len_series, start_offset_expr,
            )

        # Case 5. Positive Stop Offset and Negative Start Offset
        # For this case we just need to get the positive index of the start offset by
        # len(str) - |start_offset|
        # Where substr length: stop_offset - (len(str) - |start_offset|)  > 0
        else:
            substr_len_exp = Expression.construct(f'({stop_off} - {{}})',  start_offset_expr)

            # since start_offset is negative, if it exceeds the negative index range of the string,
            # we should start by default from 1. (postgres does it by default)
            if not is_postgres(self._base.engine):
                start_offset_expr = Expression.construct(
                    'CASE WHEN {} < {} THEN 1 ELSE {} END',
                    start_offset_expr, len_series * -1, start_offset_expr,
                )

        # wrap substr expression in case when, since substr length must be > 0
        return Expression.construct(
            f'CASE WHEN {{}} > 0 THEN substr({{}}, {{}}, {{}}) ELSE {{}} END',
            substr_len_exp,
            base_expr,
            start_offset_expr,
            substr_len_exp,
            Expression.string_value(''),
        )

    def slice(self, start=None, stop=None) -> 'SeriesString':
        """
        slice a string like you would in Python, either by calling this method, or by slicing directly
        on the `str` accessor.

        .. code-block:: python

            a.str[3]            # get one char
            a.str[3:5]          # get a slice from char 3-5
            a.str.slice(3, 5)   # idem
        """
        if isinstance(start, slice):
            return self.__getitem__(start)
        return self.__getitem__(slice(start, stop))

    def replace(
        self,
        pat: Union[str, Pattern],
        repl: str,
        n: int = -1,
        case: bool = None,
        flags: int = 0,
        regex: bool = False,
    ) -> 'SeriesString':
        """
        replace each occurrence of a pattern in SeriesString.

        :param pat: string or compiled pattern to use for replacement.
        :param repl: string to use as a replacement for each occurrence
        :param n: number of occurrences to be replaced. Only n=-1 is supported (all occurrences)
        :param case: determines if the replace is case insensitive. Considered only when regex=True.
        :param flags: regex module flags. Considered only when regex=True.
        :param regex: Determines if provided pattern is a regular expression or not.

        .. note::
          Replacements based on regular expressions are not supported yet. Therefore:
              - `pat` parameter must be string type
              - `case`, `flags`, `regex` will not be considered on replacement
        """
        if isinstance(pat, re.Pattern) or regex:
            raise NotImplementedError('Regex patterns are not supported yet.')

        if n != -1:
            raise NotImplementedError('Replacement for all occurrences is supported only.')

        expr = Expression.construct(
            f'REPLACE({{}}, {{}}, {{}})',
            self._base,
            Expression.string_value(pat),
            Expression.string_value(repl),
        )
        return self._base.copy_override(expression=expr)

    def upper(self) -> 'SeriesString':
        """
        converts string values into uppercase.

        :return: SeriesString with all alphabetic characters in uppercase
        """
        return self._base.copy_override(
            expression=Expression.construct('upper({})', self._base)
        )

    def lower(self) -> 'SeriesString':
        """
        converts string values into lowercase.

        :return: SeriesString with all alphabetic characters in lowercase
        """
        return self._base.copy_override(
            expression=Expression.construct('lower({})', self._base)
        )

    def len(self) -> 'SeriesInt64':
        """
        gets the lengths of string values.

        :return: SeriesInt64
        """
        from bach.series import SeriesInt64
        return self._base.copy_override(
            expression=Expression.construct('length({})', self._base)
        ).copy_override_type(SeriesInt64)


class SeriesString(Series):
    """
    A Series that represents the string type and its specific operations

    **Operations**

    Strings can be concatenated using the '+' operator, and the 'str' accessor can be used to get access
    to slices.

    Example:

    .. code-block:: python

        c = a + b  # concat the strings.
        a.str[3]   # get one char
        a.str[3:5] # get a slice from char 3-5


    **Database support and types**

    * Postgres: utilizes the 'text' database type.
    * Athena: utilizes the 'varchar' database type.
    * BigQuery: utilizes the 'STRING' database type.
    """

    dtype = 'string'
    dtype_aliases = ('text', str)
    supported_db_dtype = {
        DBDialect.POSTGRES: 'text',
        DBDialect.ATHENA: 'varchar',
        DBDialect.BIGQUERY: 'STRING'
    }
    supported_value_types = (str, type(None))  # NoneType ends up as a string for now

    @classmethod
    def supported_literal_to_expression(cls, dialect: Dialect, literal: Expression) -> Expression:
        # We override the parent class here because strings are really common, and we don't strictly need
        # to cast them. As all supported databases will interpret a string literal as a string.
        # Not casting string literals greatly improves the readability of the generated SQL.

        # However, there is an edge case: NULL values should be cast to string. e.g. BigQuery considers a
        # naked NULL to be INT64. Additionally, we'll always cast variables, just so this keeps working if
        # the variable get set to `None`
        if literal.to_sql(dialect=dialect).upper() == 'NULL' or get_variable_tokens([literal]):
            return super().supported_literal_to_expression(dialect=dialect, literal=literal)
        return literal

    @classmethod
    def supported_value_to_literal(
        cls,
        dialect: Dialect,
        value: str,
        dtype: StructuredDtype
    ) -> Expression:
        return Expression.string_value(value)

    @classmethod
    def dtype_to_expression(cls, dialect: Dialect, source_dtype: str, expression: Expression) -> Expression:
        if source_dtype == 'string':
            return expression
        return Expression.construct(f'cast({{}} as {cls.get_db_dtype(dialect)})', expression)

    def get_dummies(
        self,
        prefix: Optional[str] = None,
        prefix_sep: str = '_',
        dummy_na: bool = False,
        dtype: str = 'int64',
    ) -> 'DataFrame':
        """
        Convert each unique category/value from the series into a dummy/indicator variable.

        :param prefix: String to append to each new column name. By default, the prefix will be the name of
            the caller.
        :param prefix_sep: Separated between the prefix and label.
        :param dummy_na: If true, it will include ``nan`` as a variable.
        :param dtype: dtype of all new columns

        :return: DataFrame

        .. note::
            Series should contain at least one index level.
        """
        return self.to_frame().get_dummies(
            prefix=prefix, prefix_sep=prefix_sep, dummy_na=dummy_na, dtype=dtype,
        )

    @property
    def str(self) -> StringOperation:
        """
        Get access to string operations.

        .. autoclass:: bach.series.series_string.StringOperation
            :members:

        """
        return StringOperation(self)

    def __add__(self, other) -> 'Series':
        return self._binary_operation(other, 'concat', '{} || {}', other_dtypes=('string',))

    def _comparator_operation(self, other, comparator, other_dtypes=tuple(['string']),
                              strict_other_dtypes=tuple()) -> 'SeriesBoolean':
        return super()._comparator_operation(other, comparator, other_dtypes, strict_other_dtypes)

    def to_json_array(self, partition: Optional[WrappedPartition] = None) -> 'SeriesJson':
        """
        Aggregate function: Group the values of this Series into a json array

        The order of the values in the array will be based of the order of the values in this Series. If
        this Series does not have a deterministic sorting, then the values are additionally sorted by the
        values themselves. Null values will always be sorted last when aggregating all values, following
        default sorting behavior for DataFrame/Series.

        :param partition: The partition to apply, optional.
        :return: SeriesJson containing an array of strings on each row.
        """
        order_by = self.order_by
        # Add this series as the final column to sort on. If the order_by is deterministic then this won't
        # change the sorting. If order_by was not deterministic, then this will make it deterministic.
        from bach import SortColumn
        order_by += [SortColumn(expression=self.expression, asc=True)]

        order_by_expr = get_order_by_expression(
            dialect=self.engine.dialect, order_by=order_by, na_position='last',
        )
        array_agg_expression = AggregateFunctionExpression.construct('array_agg({} {})', self, order_by_expr)
        if is_postgres(self.engine):
            expression = Expression.construct('to_jsonb({})', array_agg_expression)
        elif is_bigquery(self.engine):
            expression = Expression.construct('to_json_string({})', array_agg_expression)
        else:
            raise DatabaseNotSupportedException(self.engine)

        result = self._derived_agg_func(partition, expression)
        from bach import SeriesJson
        return result.copy_override_type(SeriesJson)
