from typing import List

import bach
from bach.expression import Expression
from sql_models.util import (
    quote_identifier, is_postgres, is_athena, DatabaseNotSupportedException, is_bigquery
)


class ContextFlattening:
    """
    Class that extracts specified global contexts and location stack array from a series json based on
    the supported format per engine.
    """
    def __init__(
        self,
        contexts_series: bach.SeriesJson,
        global_contexts: List[str] = None,
        with_location_stack: bool = True,
    ) -> None:
        self._contexts_series = contexts_series
        self._global_contexts = global_contexts or []
        self._with_location_stack = with_location_stack

        if not self._global_contexts and not with_location_stack:
            raise Exception('must define which contexts to extract.')

    def __call__(self) -> bach.DataFrame:
        """
        Returns a dataframe containing a new series per requested global context
        and location stack (if required).
        """
        from modelhub.series.series_objectiv import SeriesGlobalContext, SeriesLocationStack
        result = self._contexts_series.to_frame()
        for gc in self._global_contexts:
            context_name = "".join([c.capitalize() for c in gc.split('_')]) + 'Context'
            result[gc] = self._extract_context_data(context_name).copy_override_type(SeriesGlobalContext)

        if self._with_location_stack:
            from modelhub.util import ObjectivSupportedColumns
            ls_name = str(ObjectivSupportedColumns.LOCATION_STACK.value)
            result[ls_name] = self._extract_location_stack().copy_override_type(SeriesLocationStack)

        return result.drop(columns=[self._contexts_series.name])

    def _extract_context_data(self, context_name: str) -> bach.SeriesJson:
        engine = self._contexts_series.engine
        if is_postgres(engine):
            return self._postgres_extract_context_data(context_name)

        if is_bigquery(engine):
            return self._bigquery_extract_context_data(context_name)

        if is_athena(engine):
            return self._athena_extract_context_data(context_name)

        raise DatabaseNotSupportedException(engine)

    def _extract_location_stack(self) -> bach.SeriesJson:
        """
        Extracts location stack value from context series. Currently only Athena is supported,
        as Postgres uses native objectiv taxonomy format, therefore `location_stack` value is extracted
        from a different json. For BigQuery, location_stack is already flattened for Snowplow implementation.
        """
        from modelhub.util import ObjectivSupportedColumns
        engine = self._contexts_series.engine
        ls_name = str(ObjectivSupportedColumns.LOCATION_STACK.value)
        if is_athena(engine):
            ls_series = self._athena_extract_context_data(ls_name, is_location_stack=True)
            # previous expression will return a nested array, just get the first element
            return ls_series.json[0]

        raise DatabaseNotSupportedException(engine)

    def _postgres_extract_context_data(self, context_name) -> bach.SeriesJson:
        """
        Extracts all elements where `_type` value equals to the requested context name.
        """
        dialect = self._contexts_series.engine.dialect
        expression_str = f'''
        jsonb_path_query_array({{}},
        \'$[*] ? (@._type == $type)\',
        \'{{"type":{quote_identifier(dialect, context_name)}}}\')'''
        expression = Expression.construct(
            expression_str,
            self._contexts_series,
        )
        return self._contexts_series.copy_override(expression=expression)

    def _bigquery_extract_context_data(self, context_name: str) -> bach.SeriesJson:
        # This is quite ugly, but we need to convert to JSON (pre GA), and back to string because
        # there is no nicer way to otherwise generate the JSON array that we need (as a string for now)
        # This should be revisited when we implement BQ JSON through that datatype.
        expression = Expression.construct(
            '''
            to_json_string(array(
                select ctx
                from unnest(json_query_array(parse_json({}), '$')) as ctx with offset as pos
                where json_value(ctx, '$."_type"') = {}
            ))''',
            self._contexts_series,
            Expression.string_value(context_name)
        )

        return self._contexts_series.copy_override(expression=expression)

    def _athena_extract_context_data(
        self, context_name: str, is_location_stack: bool = False,
    ) -> bach.SeriesJson:
        """
        Extracts all elements where each element's `schema` value contains the context name as a substr.
        """
        data_json_path = 'json_extract(element, \'$["data"]\')'
        if is_location_stack:
            data_json_path = f'json_extract({data_json_path}, \'$["location_stack"]\''

        expression_str = f'''
        transform(
            filter(
                cast({{}} as array(json)),
                element -> strpos(cast(json_extract(element, '$["schema"]') as varchar), {{}}) > 0
            ),
            element -> {data_json_path})'''
        expression = Expression.construct(
            expression_str,
            self._contexts_series,
            Expression.string_value(context_name)
        )

        return self._contexts_series.copy_override(expression=expression)
