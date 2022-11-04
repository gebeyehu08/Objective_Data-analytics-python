import { cleanObjectFromInternalProperties, TrackerEvent } from '@objectiv/tracker-core';
import { GLOBAL_CONTEXT_SCHEMA_BASE, LOCATION_STACK_SCHEMA_BASE } from './index';

/**
 * Helper function to convert Contexts from our Event format to Snowplow's
 */
export const makeSnowplowContexts = (event: TrackerEvent) => {
  let snowplowContexts: any[] = [];

  event.global_contexts.forEach(({ _type, ...data }) => {
    snowplowContexts.push({
      schema: `${GLOBAL_CONTEXT_SCHEMA_BASE}/${_type}/jsonschema/${event._schema_version.replace(/\./g, '-')}`,
      data: {
        ...cleanObjectFromInternalProperties(data),
      },
    });
  });

  snowplowContexts.push({
    schema: `${LOCATION_STACK_SCHEMA_BASE}/jsonschema/${event._schema_version.replace(/\./g, '-')}`,
    data: {
      location_stack: event.location_stack.map(cleanObjectFromInternalProperties),
    },
  });

  return snowplowContexts;
};
