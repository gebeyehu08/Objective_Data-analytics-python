"""
Copyright 2022 Objectiv B.V.
"""
import pandas as pd
import pytest

from bach import DataFrame

from modelhub.pipelines.extracted_contexts import ExtractedContextsPipeline, _get_taxonomy_column_definition
from tests_modelhub.data_and_utils.utils import create_engine_from_db_params, get_parsed_objectiv_data, \
    DBParams


@pytest.fixture(autouse=True)
def patch_extracted_contexts_validations(monkeypatch):
    monkeypatch.setattr(
        'modelhub.pipelines.extracted_contexts.bach.from_database.get_dtypes_from_table',
        lambda engine, table_name: {
            _get_taxonomy_column_definition(engine).name: _get_taxonomy_column_definition(engine).dtype
        }
    )

    monkeypatch.setattr(
        'modelhub.pipelines.extracted_contexts.ExtractedContextsPipeline._validate_data_dtypes',
        lambda *args, **kwargs: None,
    )


def test_get_base_dtypes(monkeypatch, db_params) -> None:
    engine = create_engine_from_db_params(db_params)

    if db_params.format == DBParams.Format.OBJECTIV:
        expected = {
            'value': 'json',
            'event_id': 'uuid',
            'day': 'date',
            'moment': 'timestamp',
            'cookie_id': 'uuid'
        }
    elif db_params.format == DBParams.Format.OBJECTIV_SNOWPLOW:
        expected = {
            'contexts_io_objectiv_taxonomy_1_0_0': [
                {
                    'event_id': 'uuid',
                    'cookie_id': 'uuid',
                    '_type': 'string',
                    '_types': 'json',
                    'location_stack': 'objectiv_location_stack',
                    'global_contexts': 'objectiv_global_contexts',
                    'time': 'int64',
                }
            ],
            'collector_tstamp': 'timestamp',
        }
    elif db_params.format == DBParams.Format.SNOWPLOW:
        # the default patch is not good enough, we need the location stack to be present as well
        monkeypatch.setattr(
            'modelhub.pipelines.extracted_contexts.bach.from_database.get_dtypes_from_table',
            lambda *args, **kwargs: {
                'contexts_io_objectiv_location_stack_1_0_0': [{'location_stack': 'string'}]
            }
        )
        expected = {
            'collector_tstamp': 'timestamp',
            'contexts_io_objectiv_location_stack_1_0_0': [{'location_stack': 'string'}],
            'event_id': 'string',
            'network_userid': 'string',
            'se_action': 'string',
            'se_category': 'string',
            'true_tstamp': 'timestamp',
        }
    else:
        raise Exception()

    pipeline = ExtractedContextsPipeline(engine, db_params.table_name, global_contexts=[])
    result = pipeline._base_dtypes

    assert expected == result


def test_convert_dtypes(db_params) -> None:
    engine = create_engine_from_db_params(db_params)

    pipeline = ExtractedContextsPipeline(engine, db_params.table_name, global_contexts=[])

    event = get_parsed_objectiv_data(engine)[0]
    pdf = pd.DataFrame(
        [
            {
                'event_id': str(event['event_id']),
                'day': str(event['day']),
                'moment': str(event['moment']),
                'user_id': str(event['cookie_id']),
            }
        ]
    )
    df = DataFrame.from_pandas(
        engine=engine,
        df=pdf,
        convert_objects=True,
    ).reset_index(drop=True)

    result = pipeline._convert_dtypes(df)
    assert result['event_id'].dtype == 'uuid'
    assert result['day'].dtype == 'date'
    assert result['moment'].dtype == 'timestamp'
    assert result['user_id'].dtype == 'uuid'
