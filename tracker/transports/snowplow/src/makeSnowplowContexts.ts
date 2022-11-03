import { cleanObjectFromInternalProperties, TrackerEvent } from '@objectiv/tracker-core';
import { GLOBAL_CONTEXT_SCHEMA_BASE, LOCATION_STACK_SCHEMA_BASE } from "./index";

/**
 * Helper function to convert Contexts from our Event format to Snowplow's
 */
export const makeSnowplowContexts = (event: TrackerEvent) => {
  let snowplowContexts: any[] = [];

  //TODO temporarily hardcoded. We need to use the new factories to get this from the event instance.
  const version = '1-0-0';

  event.global_contexts.forEach(({_type, ...data}) => {
    snowplowContexts.push({
      schema: `${GLOBAL_CONTEXT_SCHEMA_BASE}/${_type}/jsonschema/${version}`,
      data: {
        ...data,
        _types: [_type]
      }
    })
  });

  snowplowContexts.push({
    schema: `${LOCATION_STACK_SCHEMA_BASE}/jsonschema/${version}`,
    data: {
      location_stack: event.location_stack
    }
  });

  return snowplowContexts.map(cleanObjectFromInternalProperties);
}

