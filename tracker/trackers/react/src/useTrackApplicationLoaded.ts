import { useTracker } from './ObjectivProvider';
import { ReactTracker } from './ReactTracker';
import { useOnMount } from "./useOnMount";

/**
 * Triggers an ApplicationLoadedEvent when the using component mounts for the first time.
 * This hook is meant to be used high up in the Application. Eg: right after initialization and before routing.
 */
export const useTrackApplicationLoaded = (tracker: ReactTracker = useTracker()) =>
  useOnMount(() => {
    console.log(tracker);
    // TODO need schema
    //tracker.trackEvent(makeApplicationLoadedEvent());
  });
