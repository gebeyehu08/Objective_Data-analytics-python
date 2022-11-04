import { TrackerInterface, TrackerTransportInterface } from '@objectiv/tracker-core';
import { SUPPORTED_PLATFORMS } from './index';

/**
 * Retrieves some configuration options from the Tracker instance, for usability checks, and logs debug messages.
 */
export const initializeTransport = (transport: TrackerTransportInterface, tracker: TrackerInterface) => {
  const isTrackerPlatformCompatible = SUPPORTED_PLATFORMS.includes(tracker.platform);
  const isTrackerInAnonymousMode = tracker.anonymous;

  if (isTrackerPlatformCompatible && !isTrackerInAnonymousMode) {
    globalThis.objectiv.devTools?.TrackerConsole.log(
      `%c｢objectiv:${transport.transportName}｣ Initialized`,
      'font-weight: bold'
    );
  } else {
    if (!isTrackerPlatformCompatible) {
      globalThis.objectiv.devTools?.TrackerConsole.error(
        `%c｢objectiv:${transport.transportName}｣ This transport is not compatible with ${tracker.platform}.`,
        'font-weight: bold'
      );
    }
    if (isTrackerInAnonymousMode) {
      globalThis.objectiv.devTools?.TrackerConsole.warn(
        `%c｢objectiv:${transport.transportName}｣ Tracker \`anonymous\` option is not supported. Anonymous tracking should be configured in Snowplow. Check this blog post for more info: https://snowplow.io/blog/cookieless-and-anonymous-tracking-with-snowplow/`,
        'font-weight: bold'
      );
    }
  }
};
