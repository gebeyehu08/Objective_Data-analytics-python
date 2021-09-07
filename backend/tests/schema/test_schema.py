
from objectiv_backend.schema.schema import make_event_from_dict, SectionContext, HttpContext, make_context
import json
from typing import Dict, Any
from objectiv_backend.common.event_utils import add_global_context_to_event, get_context

from objectiv_backend.schema.validate_events import validate_structure_event_list
from objectiv_backend.common.config import get_config_event_schema


CLICK_EVENT_JSON = '''
{
    "events":[
        {
            "event":"ClickEvent",
            "location_stack":[
                {
                    "_context_type":"WebDocumentContext",
                    "id":"#document",
                    "url":"http://localhost:3000/"
                },{
                    "_context_type":"NavigationContext",
                    "id":"navigation"
                },{
                    "_context_type":"ButtonContext",
                    "id":"open-drawer",
                    "text":"open drawer"
                }
            ],
            "global_contexts":[
                {
                    "_context_type":"ApplicationContext",
                    "id":"rod-web-demo"
                },{
                    "_context_type":"DeviceContext",
                    "id":"device",
                    "user_agent":"mozilla"
                }
            ],
            "time":1630049334860,
            "id":"d8b0f1ca-4ebe-45b6-b7fb-7858cf46082a"
        }
    ],
    "transport_time":1630049335313
}
'''

EVENT_SCHEMA = get_config_event_schema()


def order_dict(dictionary: Dict[str, Any]) -> Dict[str, Any]:
    result = {}
    for key, value in sorted(dictionary.items()):
        if isinstance(value, dict):
            result[key] = order_dict(value)
        elif isinstance(value, list):
            result[key] = [order_dict(i) if isinstance(i, dict) else i for i in value]
        else:
            result[key] = value
    return result


def test_make_event_from_dict():
    event_list = json.loads(CLICK_EVENT_JSON)
    event_json = event_list['events'][0]
    sorted_event_json = order_dict(event_json)

    event = make_event_from_dict(event_json)
    sorted_event = order_dict(event)

    # check resulting event is the same as input event
    assert(json.dumps(sorted_event) == json.dumps(sorted_event_json))

    # check it still validates, eg, returned list of errors is empty
    assert(validate_structure_event_list([event]) == [])

    # check validation actually fails if a required property `time` is not there
    del event['time']
    assert (validate_structure_event_list([event]) != [])


def test_make_section_context():
    section_context = {
        'id': 'section_id',
        '_context_type': 'SectionContext'
    }

    context = SectionContext(**section_context)
    # check dictionaries are the same
    assert(context == section_context)
    # check json serialized versions are the same
    assert(json.dumps(context) == json.dumps(section_context))


def test_add_global_context():

    context_vars = {
        '_context_type': 'HttpContext',
        'id': 'test-http-context-id',
        'referer': 'test-referer',
        'remote_address': 'test-address',
        'user_agent': 'test-user_agent'
    }
    context = make_context(**context_vars)

    # check if we've created a proper HttpContext Object
    assert isinstance(context, HttpContext)

    # add created context to event
    event_list = json.loads(CLICK_EVENT_JSON)
    event = make_event_from_dict(event_list['events'][0])
    add_global_context_to_event(event, context)

    # check if event is still valid
    assert(validate_structure_event_list([event]) == [])

    # check if it's there, and holds the proper values
    generated_context = get_context(event, 'HttpContext')
    assert generated_context == context_vars
