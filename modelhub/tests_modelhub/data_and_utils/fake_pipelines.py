import json

import bach
import pandas
from sql_models.util import is_postgres, is_bigquery, is_athena

from modelhub import SessionizedDataPipeline
from modelhub.modelhub import SESSION_GAP_DEFAULT_SECONDS
from modelhub.pipelines.extracted_contexts import (
    NativeObjectivExtractedContextsPipeline,
    BigQueryExtractedContextsPipeline,
    AthenaQueryExtractedContextsPipeline,
)
from tests_modelhub.data_and_utils.data_objectiv import GLOBAL_CONTEXTS_IN_CURRENT_TEST_DATA

from tests_modelhub.data_and_utils.data_parsers import get_parsed_objectiv_data
from tests_modelhub.data_and_utils.utils import DBParams, create_engine_from_db_params


class FakeNativeObjectivExtractedContextsPipeline(NativeObjectivExtractedContextsPipeline):
    def _get_initial_data(self):
        return bach.DataFrame.from_pandas(
            engine=self._engine,
            df=pandas.DataFrame(get_parsed_objectiv_data(data_format=DBParams.Format.OBJECTIV)),
            convert_objects=True
        ).reset_index(drop=True)


class FakeBigQueryExtractedContextsPipeline(BigQueryExtractedContextsPipeline):
    def _get_initial_data(self):
        from tests_modelhub.data_and_utils.data_parsers import get_parsed_objectiv_data
        from tests_modelhub.data_and_utils.utils import DBParams
        pdf = pandas.DataFrame(get_parsed_objectiv_data(data_format=DBParams.Format.FLATTENED_SNOWPLOW))
        series_json_types = [
            f'contexts_io_objectiv_context_{gc}_context_1_0_0'
            for gc in GLOBAL_CONTEXTS_IN_CURRENT_TEST_DATA
        ]
        series_json_types.append('contexts_io_objectiv_location_stack_1_0_0')
        pdf[series_json_types] = pdf[series_json_types].applymap(json.dumps)
        df = bach.DataFrame.from_pandas(
            engine=self._engine,
            df=pdf,
            convert_objects=True
        ).reset_index(drop=True)
        # BigQueryExtractedContextsPipeline expects a RECORD type structure
        # and currently casting from JSON String to List is not supported by Bach,
        # therefore we should define the expression
        json_string_to_list_expr = bach.expression.Expression.construct(
            """
            ARRAY(
                SELECT STRUCT(JSON_EXTRACT_SCALAR(element, '$.location_stack') as location_stack)
                FROM UNNEST(JSON_EXTRACT_ARRAY({})) as element
            )
            """,
            df['contexts_io_objectiv_location_stack_1_0_0']
        )
        df['contexts_io_objectiv_location_stack_1_0_0'] = (
            df['contexts_io_objectiv_location_stack_1_0_0'].copy_override(expression=json_string_to_list_expr)
        ).copy_override_dtype(dtype='list', instance_dtype=[{'location_stack': 'string'}])

        for gc in GLOBAL_CONTEXTS_IN_CURRENT_TEST_DATA:
            gc_col_name = f'contexts_io_objectiv_context_{gc}_context_1_0_0'
            df[gc_col_name] = df[gc_col_name].copy_override(
                expression=bach.expression.Expression.construct('JSON_EXTRACT_ARRAY({})', df[gc_col_name])
            ).copy_override_dtype(dtype='list', instance_dtype=[{}])
        return df


class FakeAthenaExtractedContextsPipeline(AthenaQueryExtractedContextsPipeline):
    def _get_initial_data(self):
        return bach.DataFrame.from_pandas(
            engine=self._engine,
            df=pandas.DataFrame(get_parsed_objectiv_data(data_format=DBParams.Format.SNOWPLOW)),
            convert_objects=True
        ).reset_index(drop=True)


def get_fake_objectiv_df(monkeypatch, db_params, global_contexts=None) -> bach.DataFrame:
    engine = create_engine_from_db_params(db_params)
    patch_db_dtypes = {}
    if is_postgres(engine):
        ec_pipeline_klass = FakeNativeObjectivExtractedContextsPipeline
    elif is_athena(engine):
        ec_pipeline_klass = FakeAthenaExtractedContextsPipeline
        patch_db_dtypes = {'contexts': 'string'}
    elif is_bigquery(engine):
        ec_pipeline_klass = FakeBigQueryExtractedContextsPipeline
        patch_db_dtypes = {
            'contexts_io_objectiv_location_stack_1_0_0': [{'location_stack': 'string'}]
        }
        patch_db_dtypes.update({
            f'contexts_io_objectiv_context_{gc}_context_1_0_0': [{}]
            for gc in GLOBAL_CONTEXTS_IN_CURRENT_TEST_DATA
        })
    else:
        raise Exception()

    patch_db_dtypes.update(ec_pipeline_klass.BASE_REQUIRED_DB_DTYPES)
    monkeypatch.setattr(
        'modelhub.pipelines.extracted_contexts.bach.from_database.get_dtypes_from_table',
        lambda *args, **kwargs: patch_db_dtypes
    )

    data = ec_pipeline_klass(
        engine=engine, table_name=db_params.table_name, global_contexts=global_contexts or []
    )()
    sessionized_pipeline = SessionizedDataPipeline(session_gap_seconds=SESSION_GAP_DEFAULT_SECONDS)
    data = sessionized_pipeline(extracted_contexts_df=data)
    return data.set_index(keys='event_id')
