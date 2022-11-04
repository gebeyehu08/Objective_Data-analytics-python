import { NonEmptyArray, TrackerInterface, TrackerTransportInterface, TransportableEvent } from '@objectiv/tracker-core';
import { initializeTransport, makeSnowplowStructuredEvent } from '@objectiv/transport-snowplow-common';

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
      window.snowplow('trackStructEvent', makeSnowplowStructuredEvent(event));
    });
  }

  /**
   * Make this transport usable if global snowplow is available
   */
  isUsable(): boolean {
    return typeof window !== 'undefined' && typeof window.snowplow !== 'undefined';
  }
}
