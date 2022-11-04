import { NonEmptyArray, TrackerInterface, TrackerTransportInterface, TransportableEvent } from '@objectiv/tracker-core';
import { initializeTransport, makeSnowplowContexts } from '@objectiv/transport-snowplow-common';

/**
 * SnowplowJavaScriptTransport converts Objectiv's events to Snowplow's and sends them via Snowplow's JavaScript Tracker.
 */
export class SnowplowJavaScriptTransport implements TrackerTransportInterface {
  readonly transportName = `SnowplowJavaScriptTransport`;

  /**
   * Retrieves some configuration options from the Tracker instance, for usability checks
   */
  initialize(tracker: TrackerInterface) {
    initializeTransport(this, tracker);
  }

  /**
   * Converts incoming TrackerEvents to Snowplow's payloads and sends them via snowplow's 'trackStructEvent'
   */
  async handle(...args: NonEmptyArray<TransportableEvent>): Promise<Response | void> {
    (await Promise.all(args)).forEach((event) => {
      window.snowplow('trackStructEvent', {
        action: event._type,
        category: `[${event._types.map((_type) => `"${_type}"`).join(',')}]`,
        property: event.id,
        context: makeSnowplowContexts(event),
      });
    });
  }

  /**
   * Make this transport usable if global snowplow is available
   */
  isUsable(): boolean {
    return typeof window !== 'undefined' && typeof window.snowplow !== 'undefined';
  }
}
