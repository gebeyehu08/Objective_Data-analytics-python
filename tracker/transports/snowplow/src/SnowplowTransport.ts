import {
  NonEmptyArray,
  TrackerInterface,
  TrackerPlatform,
  TrackerTransportInterface,
  TransportableEvent,
} from '@objectiv/tracker-core';
import { makeSnowplowContexts } from './makeSnowplowContexts';

/**
 * An array of the TrackerPlatforms this Transport plugin supports
 */
const SUPPORTED_PLATFORMS = [
  TrackerPlatform.ANGULAR,
  TrackerPlatform.BROWSER,
  TrackerPlatform.CORE,
  TrackerPlatform.REACT,
];

/**
 * SnowplowTransport converts incoming events from Objectiv's TrackerEvent instances to Snowplow's Tracker Protocol.
 */
export class SnowplowTransport implements TrackerTransportInterface {
  readonly transportName = `SnowplowTransport`;
  isTrackerPlatformCompatible: boolean = false;
  isTrackerInAnonymousMode: boolean = false;
  isGlobalSnowplowAvailable = typeof window !== 'undefined' && typeof window.snowplow !== 'undefined';

  /**
   * Retrieves some configuration options from the Tracker instance, for usability checks
   */
  initialize(tracker: TrackerInterface) {
    this.isTrackerPlatformCompatible = SUPPORTED_PLATFORMS.includes(tracker.platform);
    this.isTrackerInAnonymousMode = tracker.anonymous;

    if (this.isTrackerPlatformCompatible && !this.isTrackerInAnonymousMode) {
      globalThis.objectiv.devTools?.TrackerConsole.log(
        `%c｢objectiv:${this.transportName}｣ Initialized`,
        'font-weight: bold'
      );
    } else {
      if (!this.isTrackerPlatformCompatible) {
        globalThis.objectiv.devTools?.TrackerConsole.error(
          `%c｢objectiv:${this.transportName}｣ This transport is not compatible with ${tracker.platform}.`,
          'font-weight: bold'
        );
      }
      if (this.isTrackerInAnonymousMode) {
        globalThis.objectiv.devTools?.TrackerConsole.warn(
          `%c｢objectiv:${this.transportName}｣ Tracker \`anonymous\` option is not supported. Anonymous tracking should be configured in Snowplow. Check this blog post for more info: https://snowplow.io/blog/cookieless-and-anonymous-tracking-with-snowplow/`,
          'font-weight: bold'
        );
      }
    }
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
   * Make this transport usable if snowplow is available and if the Tracker instance platform is supported
   */
  isUsable(): boolean {
    return this.isGlobalSnowplowAvailable && this.isTrackerPlatformCompatible;
  }
}
