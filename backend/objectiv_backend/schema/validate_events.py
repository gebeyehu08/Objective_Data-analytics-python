"""
Copyright 2021 Objectiv B.V.
"""
import argparse
import json
import sys
from typing import List, Any, Dict, NamedTuple, Set
import uuid
import requests

from objectiv_backend.common.config import \
    get_config_timestamp_validation, get_collector_config

from objectiv_backend.common.types import EventData, EventDataList


class ErrorInfo(NamedTuple):
    data: Any
    info: str

    def asdict(self):
        return self._asdict()


class EventError(Dict):
    event_id: uuid.UUID
    error_info: List[ErrorInfo]

    def __init__(self, event_id: uuid.UUID, error_info: List[ErrorInfo]):
        self.event_id = event_id
        self.error_info = error_info

        # we use a dictionary representation, to make sure we can serialize it with the JSON encoder
        dict.__init__(self, event_id=event_id.__str__(), error_info=[e.asdict() for e in error_info])


def validate_event_adheres_to_schema(event: EventData) -> List[ErrorInfo]:
    errors = []
    ignore_keys = ['_types', 'corrected_time', 'transport_time', 'collector_time']
    event_copy = {k: v for k, v in event.items() if k not in ignore_keys}
    config = get_collector_config()
    headers = {'Content-type': 'Application/json'}

    try:
        response = requests.post(config.schema_validation_service_url, json=event_copy, headers=headers)

        if response.status_code == 200:
            # we have a valid response, let's check the validation result
            result = response.json()
            if not result['success']:
                for e in result['error']['issues']:
                    errors.append(ErrorInfo(data=event, info=e))

    except requests.exceptions.ConnectionError as e:
        errors.append(ErrorInfo(data=event, info=f'calling validation service failed: {e}'))

    return errors


def validate_event_time(event: EventData, current_millis: int) -> List[ErrorInfo]:
    """
    Validate timestamps in event to check if it's not too old or too new
    :param event:
    :param current_millis:
    :return: [ErrorInfo], if any
    """
    max_delay = get_config_timestamp_validation().max_delay
    if max_delay and current_millis - event['time'] > max_delay:
        return [ErrorInfo(event, f'Event too old: {current_millis - event["time"]} > {max_delay}')]
    # allow for a 5 minute clock skew into the future
    if event['time'] > current_millis + 300000:
        return [ErrorInfo(event, f'Event in the future: {event["time"]} > {current_millis}')]
    return []

