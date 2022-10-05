"""
Copyright 2021 Objectiv B.V.
"""
import json

from flask import Response

from objectiv_backend.common.config import get_collector_config
from objectiv_backend.end_points.common import get_json_response


def schema() -> Response:
    """ Endpoint that returns the event schema in our own notation. """
    msg = 'not implemented'
    return get_json_response(status=200, msg=msg)


def json_schema() -> Response:
    """ Endpoint that returns a jsonschema that describes the event schema. """
    msg = 'not implemented'
    return get_json_response(status=200, msg=msg)
