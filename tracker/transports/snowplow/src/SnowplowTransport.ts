import { NonEmptyArray, TrackerTransportInterface, TransportableEvent } from '@objectiv/tracker-core';
import { makeSnowplowContexts } from './makeSnowplowContexts';

/**
 * SnowplowTransport converts incoming events from Objectiv's TrackerEvent instances to Snowplow's Tracker Protocol.
 */
export class SnowplowTransport implements TrackerTransportInterface {
  readonly transportName = `SnowplowTransport`;

  /**
   * The constructor is merely responsible for logging
   */
  constructor() {
    globalThis.objectiv.devTools?.TrackerConsole.log(
      `%c｢objectiv:${this.transportName}｣ Initialized`,
      'font-weight: bold'
    );
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
   * Make this transport usable if snowplow is available in the window interface
   */
  isUsable(): boolean {
    return typeof window !== 'undefined' && typeof window.snowplow !== 'undefined';
  }
}
