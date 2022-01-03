/*
 * Copyright 2022 Objectiv B.V.
 */

import { Tracker } from '@objectiv/tracker-core';
import { fireEvent, getByText, render } from '@testing-library/react';
import {
  LocationTree,
  NavigationContextWrapper,
  ObjectivProvider,
  trackPressEvent,
  usePressEventTracker,
} from '../src';

describe('NavigationContextWrapper', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    LocationTree.clear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should wrap the given children in a NavigationContext (trigger via Component)', () => {
    const spyTransport = { transportName: 'SpyTransport', handle: jest.fn(), isUsable: () => true };
    const tracker = new Tracker({ applicationId: 'app-id', transport: spyTransport });
    jest.spyOn(spyTransport, 'handle');

    const navigationContextProps = { id: 'test-navigation' };
    const TrackedButton = () => {
      const trackPressEvent = usePressEventTracker();
      return <nav onClick={trackPressEvent}>Trigger Event</nav>;
    };
    const { container } = render(
      <ObjectivProvider tracker={tracker}>
        <NavigationContextWrapper {...navigationContextProps}>
          <TrackedButton />
        </NavigationContextWrapper>
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    fireEvent.click(getByText(container, /trigger event/i));

    expect(spyTransport.handle).toHaveBeenCalledTimes(1);
    expect(spyTransport.handle).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        _type: 'PressEvent',
        location_stack: [
          expect.objectContaining({
            _type: 'NavigationContext',
            ...navigationContextProps,
          }),
        ],
      })
    );
  });

  it('should wrap the given children in a NavigationContext (trigger via render-props)', () => {
    const spyTransport = { transportName: 'SpyTransport', handle: jest.fn(), isUsable: () => true };
    const tracker = new Tracker({ applicationId: 'app-id', transport: spyTransport });
    jest.spyOn(spyTransport, 'handle');

    const navigationContextProps = { id: 'test-navigation' };
    const { container } = render(
      <ObjectivProvider tracker={tracker}>
        <NavigationContextWrapper {...navigationContextProps}>
          {(trackingContext) => <nav onClick={() => trackPressEvent(trackingContext)}>Trigger Event</nav>}
        </NavigationContextWrapper>
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    fireEvent.click(getByText(container, /trigger event/i));

    expect(spyTransport.handle).toHaveBeenCalledTimes(1);
    expect(spyTransport.handle).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        _type: 'PressEvent',
        location_stack: [
          expect.objectContaining({
            _type: 'NavigationContext',
            ...navigationContextProps,
          }),
        ],
      })
    );
  });
});
