import json
from collections import defaultdict
from datetime import datetime, timezone, date
from typing import Dict, Any, Tuple
from uuid import UUID

from tests_modelhub.data_and_utils.data_objectiv import TEST_DATA_OBJECTIV
from tests_modelhub.data_and_utils.utils import DBParams

_EVENTS_WITH_DOMAIN_SESSIONID = ['12b55ed5-4295-4fc1-bf1f-88d64d1ac304', '12b55ed5-4295-4fc1-bf1f-88d64d1ac305']


def get_extracted_contexts_data_from_parsed_objectiv_data(data_format: DBParams.Format):
    native_initial_event_data = get_parsed_objectiv_data(DBParams.Format.OBJECTIV)
    extracted_contexts_data = []

    for event_data in native_initial_event_data:
        flattened_gc = defaultdict(list)
        for gc in event_data['value']['global_contexts']:
            gc_name, gc_data = _get_global_context_data(gc, data_format)
            flattened_gc[gc_name].append(gc_data)

        ec_event_data = {
            'event_id': event_data['event_id'],
            'user_id': event_data['cookie_id'],
            'day': event_data['day'],
            'moment': event_data['moment'],
            'event_type': event_data['value']['_type'],
            'stack_event_types': event_data['value']['_types'],
            'location_stack': event_data['value']['location_stack'],
            **flattened_gc,
        }
        if data_format == DBParams.Format.OBJECTIV:
            extracted_contexts_data.append(ec_event_data)
            continue

        parsed_sp_event_data = _parse_event_data_to_snowplow_format(event_data, data_format)
        # for snowplow, some fields differ: user_id, moment and day
        ec_event_data['user_id'] = UUID(
            parsed_sp_event_data['network_userid'] or parsed_sp_event_data['domain_sessionid']
        )
        ec_event_data['day'] = date.fromtimestamp(parsed_sp_event_data['derived_tstamp'].timestamp())
        ec_event_data['moment'] = parsed_sp_event_data['derived_tstamp']

        extracted_contexts_data.append(ec_event_data)

    return extracted_contexts_data


def get_parsed_objectiv_data(data_format: DBParams.Format):
    parsed_data = []
    for event_data in TEST_DATA_OBJECTIV:
        event_id, day, moment, cookie_id, value = event_data
        native_event_data = {
            'event_id': UUID(event_id),
            'day': datetime.strptime(day, '%Y-%m-%d').date(),
            'moment': datetime.fromisoformat(moment),
            'cookie_id': UUID(cookie_id),
            'value': json.loads(value)
        }

        if data_format == DBParams.Format.OBJECTIV:
            parsed_data.append(native_event_data)
        else:
            parsed_data.append(
                _parse_event_data_to_snowplow_format(native_event_data, data_format)
            )

    return parsed_data


def _parse_event_data_to_snowplow_format(event_data: Dict[str, Any], data_format: DBParams.Format) -> Dict[str, Any]:
    parsed_moment = event_data['moment'].replace(tzinfo=timezone.utc)
    parsed_time_val = int(parsed_moment.timestamp() * 1e3)

    parsed_event_data = {
        'collector_tstamp': datetime.utcfromtimestamp(parsed_time_val / 1e3),
        'event_id': str(event_data['event_id']),
        'network_userid': (
            str(event_data['cookie_id']) if str(event_data['event_id']) not in _EVENTS_WITH_DOMAIN_SESSIONID
            else None
        ),
        'domain_sessionid': (
             str(event_data['cookie_id']) if str(event_data['event_id']) in _EVENTS_WITH_DOMAIN_SESSIONID
             else None
        ),
        'se_action': event_data['value']['_type'],
        'se_category': json.dumps(event_data['value']['_types']),
        'derived_tstamp': datetime.utcfromtimestamp(parsed_time_val / 1e3),
    }
    if data_format == DBParams.Format.SNOWPLOW:
        parsed_event_data.update(_parse_native_taxonomy_to_native_snowplow(event_data['value']))

    if data_format == DBParams.Format.FLATTENED_SNOWPLOW:
        parsed_event_data.update(_parse_native_taxonomy_to_flattened_snowplow(event_data['value']))

    return parsed_event_data


def _parse_native_taxonomy_to_flattened_snowplow(taxonomy_json: Dict[str, Any]) -> Dict[str, Any]:
    gc_converted = defaultdict(list)
    for gc in taxonomy_json['global_contexts']:
        gc_name, gc_data = _get_global_context_data(gc, DBParams.Format.FLATTENED_SNOWPLOW)
        gc_converted[f'contexts_io_objectiv_context_{gc_name}_context_1_0_0'].append(gc_data)

    return {
        **gc_converted,
        'contexts_io_objectiv_location_stack_1_0_0': [
            {'location_stack': json.dumps(taxonomy_json['location_stack'])}
        ]
    }


def _parse_native_taxonomy_to_native_snowplow(taxonomy_json: Dict[str, Any]) -> Dict[str, Any]:
    contexts = []
    for gc in taxonomy_json['global_contexts']:
        gc_name, gc_data = _get_global_context_data(gc, DBParams.Format.SNOWPLOW)
        schema = f"iglu:io.objectiv.context/{gc_name}/jsonschema/1-0-0"
        contexts.append({"schema": schema, "data": gc_data})

    contexts.append(
        {
            "schema": "iglu:io.objectiv/location_stack/jsonschema/1-0-0",
            "data": {"location_stack": taxonomy_json['location_stack']}
        }
    )
    return {
        'contexts': json.dumps(
            {"schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0", "data": contexts}
        )
    }


def _get_global_context_data(
    global_context: Dict[str, Any], db_format: DBParams.Format
) -> Tuple[str, Dict[str, Any]]:
    # convert from CamelCase to snake_case
    context_name = ''.join(
        [
            '_' + token.lower()
            if token.isupper() else token
            for token in global_context['_type'].replace('Context', '')
        ]
    ).lstrip('_')

    if db_format != DBParams.Format.OBJECTIV:
        # SP format does not carry types
        gc_data = {key: value for key, value in global_context.items() if not key.startswith('_')}
    else:
        gc_data = global_context.copy()
    return context_name, gc_data
