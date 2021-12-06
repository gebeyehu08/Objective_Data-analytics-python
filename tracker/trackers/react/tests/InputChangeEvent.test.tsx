/*
 * Copyright 2021 Objectiv B.V.
 */

import { makeInputChangeEvent } from '@objectiv/tracker-core';
import { render } from '@testing-library/react';
import {
  LocationProvider,
  ReactTracker,
  TrackerProvider,
  trackInputChangeEvent,
  useInputChangeEventTracker,
} from '../src';

describe('InputChangeEvent', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should track an InputChangeEvent (programmatic)', () => {
    const tracker = new ReactTracker({ applicationId: 'app-id' });
    jest.spyOn(tracker, 'trackEvent');

    trackInputChangeEvent({ tracker });

    expect(tracker.trackEvent).toHaveBeenCalledTimes(1);
    expect(tracker.trackEvent).toHaveBeenNthCalledWith(1, expect.objectContaining(makeInputChangeEvent()));
  });

  it('should track an InputChangeEvent (hook relying on ObjectivProvider)', () => {
    const spyTransport = { transportName: 'SpyTransport', handle: jest.fn(), isUsable: () => true };
    const tracker = new ReactTracker({ applicationId: 'app-id', transport: spyTransport });

    const Component = () => {
      const trackInputChangeEvent = useInputChangeEventTracker();
      trackInputChangeEvent();

      return <>Component triggering InputChangeEvent</>;
    };

    render(
      <TrackerProvider tracker={tracker}>
        <LocationProvider locationEntries={[]}>
          <Component />
        </LocationProvider>
      </TrackerProvider>
    );

    expect(spyTransport.handle).toHaveBeenCalledTimes(1);
    expect(spyTransport.handle).toHaveBeenNthCalledWith(1, expect.objectContaining({ _type: 'InputChangeEvent' }));
  });

  it('should track an InputChangeEvent (hook with custom tracker)', () => {
    const tracker = new ReactTracker({ applicationId: 'app-id' });
    jest.spyOn(tracker, 'trackEvent');

    const customTracker = new ReactTracker({ applicationId: 'app-id-2' });
    jest.spyOn(customTracker, 'trackEvent');

    const Component = () => {
      const trackInputChangeEvent = useInputChangeEventTracker(customTracker);
      trackInputChangeEvent();

      return <>Component triggering InputChangeEvent</>;
    };

    render(
      <TrackerProvider tracker={tracker}>
        <LocationProvider locationEntries={[]}>
          <Component />
        </LocationProvider>
      </TrackerProvider>
    );

    expect(tracker.trackEvent).not.toHaveBeenCalled();
    expect(customTracker.trackEvent).toHaveBeenCalledTimes(1);
    expect(customTracker.trackEvent).toHaveBeenNthCalledWith(1, expect.objectContaining(makeInputChangeEvent()));
  });
});
