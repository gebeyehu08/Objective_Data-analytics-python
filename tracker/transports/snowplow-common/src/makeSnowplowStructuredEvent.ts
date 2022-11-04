import { TrackerEvent } from '@objectiv/tracker-core';
import { makeSnowplowContexts } from './index';

/**
 * Helper function to build a Snowplow's Structured Event from an Objectiv Event
 */
export const makeSnowplowStructuredEvent = (event: TrackerEvent) => ({
  action: event._type,
  category: `[${event._types.map((_type) => `"${_type}"`).join(',')}]`,
  property: event.id,
  context: makeSnowplowContexts(event),
});
