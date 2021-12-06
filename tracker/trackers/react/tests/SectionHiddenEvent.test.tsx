/*
 * Copyright 2021 Objectiv B.V.
 */

import { makeSectionHiddenEvent } from '@objectiv/tracker-core';
import { render } from '@testing-library/react';
import {
  LocationProvider,
  ReactTracker,
  TrackerProvider,
  trackSectionHiddenEvent,
  useSectionHiddenEventTracker,
} from '../src';

describe('SectionHiddenEvent', () => {
  it('should track a SectionHiddenEvent (programmatic)', () => {
    const tracker = new ReactTracker({ applicationId: 'app-id' });
    jest.spyOn(tracker, 'trackEvent');

    trackSectionHiddenEvent({ tracker });

    expect(tracker.trackEvent).toHaveBeenCalledTimes(1);
    expect(tracker.trackEvent).toHaveBeenNthCalledWith(1, expect.objectContaining(makeSectionHiddenEvent()));
  });

  it('should track an SectionHiddenEvent (hook relying on ObjectivProvider)', () => {
    const spyTransport = { transportName: 'SpyTransport', handle: jest.fn(), isUsable: () => true };
    const tracker = new ReactTracker({ applicationId: 'app-id', transport: spyTransport });

    const Component = () => {
      const trackSectionHiddenEvent = useSectionHiddenEventTracker();
      trackSectionHiddenEvent();

      return <>Component triggering SectionHiddenEvent</>;
    };

    render(
      <TrackerProvider tracker={tracker}>
        <LocationProvider locationEntries={[]}>
          <Component />
        </LocationProvider>
      </TrackerProvider>
    );

    expect(spyTransport.handle).toHaveBeenCalledTimes(1);
    expect(spyTransport.handle).toHaveBeenNthCalledWith(1, expect.objectContaining({ _type: 'SectionHiddenEvent' }));
  });

  it('should track an SectionHiddenEvent (hook with custom tracker)', () => {
    const tracker = new ReactTracker({ applicationId: 'app-id' });
    jest.spyOn(tracker, 'trackEvent');

    const customTracker = new ReactTracker({ applicationId: 'app-id-2' });
    jest.spyOn(customTracker, 'trackEvent');

    const Component = () => {
      const trackSectionHiddenEvent = useSectionHiddenEventTracker(customTracker);
      trackSectionHiddenEvent();

      return <>Component triggering SectionHiddenEvent</>;
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
    expect(customTracker.trackEvent).toHaveBeenNthCalledWith(1, expect.objectContaining(makeSectionHiddenEvent()));
  });
});
