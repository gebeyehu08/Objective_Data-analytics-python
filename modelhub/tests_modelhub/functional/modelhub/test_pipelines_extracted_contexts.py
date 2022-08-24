"""
Copyright 2022 Objectiv B.V.
"""
import datetime
import json
from typing import List

import bach
import pandas as pd
import pytest
from sql_models.util import is_bigquery
from tests.functional.bach.test_data_and_utils import assert_equals_data

from modelhub import ExtractedContextsPipeline
from tests_modelhub.data_and_utils.utils import create_engine_from_db_params, get_parsed_objectiv_data, \
    DBParams

_EXPECTED_CONTEXT_COLUMNS = [
    'event_id',
    'day',
    'moment',
    'user_id',
    'location_stack',
    'event_type',
    'stack_event_types',
]


def _get_parsed_test_data_pandas_df(engine, db_format: DBParams.Format) -> pd.DataFrame:
    parsed_data = get_parsed_objectiv_data(engine)
    if not is_bigquery(engine):
        assert db_format == DBParams.Format.OBJECTIV
        return pd.DataFrame(parsed_data)

    bq_data = []
    for event in parsed_data:
        if db_format == DBParams.Format.OBJECTIV_SNOWPLOW:
            taxonomy_data = [
                {
                    '_type': event['value']['_type'],
                    '_types': json.dumps(event['value']['_types']),
                    'global_contexts': json.dumps(event['value']['global_contexts']),
                    'location_stack': json.dumps(event['value']['location_stack']),
                    'time': event['value']['time'],
                    'event_id': str(event['event_id']),
                    'cookie_id': str(event['cookie_id']),
                }
            ]
            bq_data.append(
                {
                    'contexts_io_objectiv_taxonomy_1_0_0': taxonomy_data,
                    'collector_tstamp': datetime.datetime.utcfromtimestamp(event['value']['time'] / 1e3),
                }
            )
        elif db_format == DBParams.Format.SNOWPLOW :
            bq_data.append(
                {
                    'collector_tstamp': datetime.datetime.utcfromtimestamp(event['value']['time'] / 1e3),
                    'event_id': str(event['event_id']),
                    'network_userid': str(event['cookie_id']),
                    'se_action': event['value']['_type'],
                    'se_category': json.dumps(event['value']['_types']),
                    'true_tstamp': datetime.datetime.utcfromtimestamp(event['value']['time'] / 1e3),
                    'contexts_io_objectiv_location_stack_1_0_0': [
                        {'location_stack': json.dumps(event['value']['location_stack'])}
                    ],
                }
            )

    return pd.DataFrame(bq_data)


def get_expected_context_pandas_df(
        engine, db_format: DBParams.Format, global_contexts: List[str] = None,
) -> pd.DataFrame:

    field_name_mapping = {}
    for context_name in global_contexts or []:
        capitalized_name = context_name.capitalize()+'Context'
        field_name_mapping[capitalized_name] = context_name

    data = get_parsed_objectiv_data(engine)

    # Append requested global contexts, and remove the all containing one
    for i, row in enumerate(data):
        # create one column for every requested context, for every row
        row_context_data = {c: [] for c in field_name_mapping.values()}
        for row_context_item in row['value']['global_contexts']:
            if row_context_item['_type'] in field_name_mapping:
                toplevel_field_name = field_name_mapping[row_context_item['_type']]
                if db_format == DBParams.Format.SNOWPLOW:
                    del(row_context_item['_type'])
                row_context_data[toplevel_field_name].append(row_context_item)
        row['value'] = {**row['value'], **row_context_data}
        del(row['value']['global_contexts'])

    pdf = pd.DataFrame(data)
    context_pdf = pdf['value'].apply(pd.Series)

    context_pdf['event_id'] = pdf['event_id']
    context_pdf['day'] = pdf['day']
    context_pdf['moment'] = pdf['moment']
    context_pdf['user_id'] = pdf['cookie_id']
    context_pdf = context_pdf.rename(
        columns={
            '_type': 'event_type',
            '_types': 'stack_event_types',
        }
    )

    return context_pdf[_EXPECTED_CONTEXT_COLUMNS + (global_contexts or [])]


def _get_extracted_contexts_pipeline(db_params, global_contexts=[]) -> ExtractedContextsPipeline:
    engine = create_engine_from_db_params(db_params)
    return ExtractedContextsPipeline(engine=engine, table_name=db_params.table_name,
                                     global_contexts=global_contexts)


def test_get_pipeline_result(db_params) -> None:
    context_pipeline = _get_extracted_contexts_pipeline(db_params, global_contexts=['identity'])
    engine = context_pipeline._engine

    result = context_pipeline().sort_values(by='event_id').to_pandas()

    expected = get_expected_context_pandas_df(
        engine, global_contexts=['identity'], db_format=db_params.format
    )
    pd.testing.assert_frame_equal(expected, result)


def test_get_initial_data(db_params) -> None:
    context_pipeline = _get_extracted_contexts_pipeline(db_params)
    engine = context_pipeline._engine
    expected = _get_parsed_test_data_pandas_df(engine, db_params.format)
    result = context_pipeline._get_initial_data()

    if db_params.format == DBParams.Format.OBJECTIV:
        assert set(result.data_columns) == set(expected.columns)
        sorted_columns = sorted(result.data_columns)
        result = result[sorted_columns].sort_values(by='event_id')
        assert_equals_data(
            result,
            expected_columns=sorted_columns,
            expected_data=expected[sorted_columns].to_numpy().tolist(),
            use_to_pandas=True,
        )
        return

    if db_params.format == DBParams.Format.OBJECTIV_SNOWPLOW:
        taxonomy_column = 'contexts_io_objectiv_taxonomy_1_0_0'
        assert taxonomy_column in result.data
        assert isinstance(result[taxonomy_column], bach.SeriesList)

        # need to sort the rows since order is non-deterministic
        result['event_id'] = result[taxonomy_column].elements[0].elements['event_id']
        result = result.sort_values(by='event_id')
        result = result[[taxonomy_column, 'collector_tstamp']]

        assert_equals_data(
            result,
            expected_columns=[taxonomy_column, 'collector_tstamp'],
            expected_data=expected.to_numpy().tolist(),
            use_to_pandas=True,
        )
    elif db_params.format == DBParams.Format.SNOWPLOW:
        location_stack_column = 'contexts_io_objectiv_location_stack_1_0_0'
        assert location_stack_column in result.data
        assert result[location_stack_column].dtype == 'list'
        assert result[location_stack_column].elements[0].elements['location_stack'].dtype == 'string'
        assert 'event_id' in result.data

        # need to sort the rows since order is non-deterministic
        result = result.sort_values(by='event_id')

        assert_equals_data(
            result,
            expected_columns=['collector_tstamp', 'event_id', 'network_userid', 'se_action',
                              'se_category', 'true_tstamp', 'contexts_io_objectiv_location_stack_1_0_0'],
            expected_data=expected.to_numpy().tolist(),
            use_to_pandas=True,
        )
    else:
        raise Exception()


def test_process_taxonomy_data(db_params) -> None:
    context_pipeline = _get_extracted_contexts_pipeline(db_params)
    engine = context_pipeline._engine

    df = context_pipeline._get_initial_data()
    result = context_pipeline._process_taxonomy_data(df).reset_index(drop=True)

    expected_series = [
        'user_id', 'event_type', 'stack_event_types', 'location_stack', 'event_id', 'day', 'moment',
    ]
    if is_bigquery(engine):
        # day and moment are parsed after processing base data
        expected_series = expected_series[:-2]

    for expected_s in expected_series:
        assert expected_s in result.data

    result = result.sort_values(by='event_id')[expected_series]
    expected = get_expected_context_pandas_df(engine, db_format=db_params.format)[expected_series]

    rpd = result.to_pandas()

    pd.testing.assert_frame_equal(
        expected,
        rpd,
        check_index_type=False,
    )


def test_apply_extra_processing(db_params) -> None:
    context_pipeline = _get_extracted_contexts_pipeline(db_params)
    engine = context_pipeline._engine

    df = context_pipeline._get_initial_data()
    df = context_pipeline._process_taxonomy_data(df)
    result = context_pipeline._apply_extra_processing(df)

    if not is_bigquery(engine):
        assert df == result
        return None

    assert 'day' not in df.data
    assert 'day' in result.data

    assert 'moment' not in df.data
    assert 'moment' in result.data

    expected_data = (
        get_expected_context_pandas_df(engine, db_format=db_params.format)[['day', 'moment']]
        .values.tolist()
    )

    assert_equals_data(
        result.sort_values(by='event_id')[['day', 'moment']],
        expected_columns=['day', 'moment'],
        expected_data=expected_data,
        use_to_pandas=True,
    )


@pytest.mark.skip_postgres
def test_apply_extra_processing_duplicated_event_ids(db_params) -> None:
    context_pipeline = _get_extracted_contexts_pipeline(db_params)
    engine = context_pipeline._engine

    default_timestamp = datetime.datetime(2022, 1, 1,  1,  1, 1)
    pdf = pd.DataFrame(
        {
            'event_id': ['1', '2', '3', '1', '4', '1', '4'],
            'collector_tstamp': [
                datetime.datetime(2022, 1, 1, 12,  0, 0),
                default_timestamp,
                default_timestamp,
                datetime.datetime(2022, 1, 1, 12,  0, 1),
                datetime.datetime(2022, 1, 2, 12,  0, 1),
                datetime.datetime(2022, 1, 1, 11, 59, 59),
                datetime.datetime(2022, 1, 3, 12, 0, 1),
            ],
            'time': [int(default_timestamp.timestamp() * 1e3)] * 7,
            'contexts_io_objectiv_taxonomy_1_0_0': ['{}'] * 7,
        }
    )
    df = bach.DataFrame.from_pandas(engine, pdf, convert_objects=True).reset_index(drop=True)
    result = context_pipeline._apply_extra_processing(df)

    assert_equals_data(
        result.sort_values(by='event_id')[['event_id', 'collector_tstamp']],
        expected_columns=['event_id', 'collector_tstamp'],
        expected_data=[
            ['1', datetime.datetime(2022, 1, 1, 11, 59, 59)],
            ['2', default_timestamp],
            ['3', default_timestamp],
            ['4', datetime.datetime(2022, 1, 2, 12,  0, 1)],
        ],
        use_to_pandas=True,
    )


def test_apply_date_filter(db_params) -> None:
    context_pipeline = _get_extracted_contexts_pipeline(db_params)
    engine = context_pipeline._engine

    pdf = get_expected_context_pandas_df(engine, db_params.format)[['event_id', 'day']]
    if is_bigquery(engine):
        pdf['event_id'] = pdf['event_id'].astype(str)

    df = bach.DataFrame.from_pandas(engine=engine, df=pdf, convert_objects=True)
    df = df.reset_index(drop=True)

    result = context_pipeline._apply_date_filter(df)
    assert df == result

    start_date = '2021-12-01'
    result = context_pipeline._apply_date_filter(df, start_date=start_date).sort_values(by='event_id')
    start_mask = pdf['day'] >= datetime.datetime.strptime(start_date, '%Y-%m-%d').date()
    expected = pdf[start_mask].reset_index(drop=True)

    pd.testing.assert_frame_equal(expected, result.to_pandas(), check_index_type=False)

    end_date = '2021-12-02'
    result = context_pipeline._apply_date_filter(df, end_date=end_date).sort_values(by='event_id')
    end_mask = pdf['day'] <= datetime.datetime.strptime(end_date, '%Y-%m-%d').date()
    expected = pdf[end_mask].reset_index(drop=True)

    pd.testing.assert_frame_equal(expected, result.to_pandas(), check_index_type=False)

    result = context_pipeline._apply_date_filter(
        df, start_date=start_date, end_date=end_date,
    ).sort_values(by='event_id')
    expected = pdf[start_mask & end_mask].reset_index(drop=True)

    pd.testing.assert_frame_equal(expected, result.to_pandas(), check_index_type=False)

