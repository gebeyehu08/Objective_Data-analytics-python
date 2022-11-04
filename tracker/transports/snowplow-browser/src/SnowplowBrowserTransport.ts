import { NonEmptyArray, TrackerInterface, TrackerTransportInterface, TransportableEvent } from '@objectiv/tracker-core';
import { initializeTransport, makeSnowplowStructuredEvent } from '@objectiv/transport-snowplow-common';
import { trackStructEvent } from '@snowplow/browser-tracker';

/**
 * SnowplowBrowserTransport converts Objectiv's events to Snowplow's and sends them via Snowplow's Browser Tracker.
 */
export class SnowplowBrowserTransport implements TrackerTransportInterface {
  readonly transportName = `SnowplowBrowserTransport`;

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
      trackStructEvent(makeSnowplowStructuredEvent(event));
    });
  }

  /**
   * Make this transport usable if trackStructEvent is defined, e.g. the peer module is available
   */
  isUsable(): boolean {
    return typeof trackStructEvent !== 'undefined';
  }
}
