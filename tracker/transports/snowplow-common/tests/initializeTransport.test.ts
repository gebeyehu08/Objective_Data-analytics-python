/*
 * Copyright 2022 Objectiv B.V.
 */

import { LogTransport, MockConsoleImplementation } from '@objectiv/testing-tools';
import { Tracker, TrackerPlatform } from '@objectiv/tracker-core';
import { initializeTransport } from '../src';

require('@objectiv/developer-tools');
globalThis.objectiv.devTools?.TrackerConsole.setImplementation(MockConsoleImplementation);

describe('initializeTransport', () => {
  it('should TrackerConsole.log an initialization message', () => {
    const tracker = new Tracker({ applicationId: 'test' });
    initializeTransport(new LogTransport(), tracker);
    expect(MockConsoleImplementation.log).toHaveBeenCalledWith(
      '%c｢objectiv:LogTransport｣ Initialized',
      'font-weight: bold'
    );
  });

  it('should log an error when the Tracker platform is not supported', async () => {
    const mockReactNativeTracker = new Tracker({ applicationId: 'test', platform: TrackerPlatform.REACT_NATIVE });
    initializeTransport(new LogTransport(), mockReactNativeTracker);
    expect(MockConsoleImplementation.error).toHaveBeenCalledWith(
      '%c｢objectiv:LogTransport｣ This transport is not compatible with REACT_NATIVE.',
      'font-weight: bold'
    );
  });

  it('should warn about anonymous mode not being supported', async () => {
    const tracker = new Tracker({ applicationId: 'test', anonymous: true });
    initializeTransport(new LogTransport(), tracker);
    expect(MockConsoleImplementation.warn).toHaveBeenCalledWith(
      '%c｢objectiv:LogTransport｣ Tracker `anonymous` option is not supported. Anonymous tracking should be configured in Snowplow. Check this blog post for more info: https://snowplow.io/blog/cookieless-and-anonymous-tracking-with-snowplow/',
      'font-weight: bold'
    );
  });
});

describe('Without developer tools', () => {
  let objectivGlobal = globalThis.objectiv;

  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.objectiv.devTools = undefined;
  });

  afterEach(() => {
    globalThis.objectiv = objectivGlobal;
  });

  it('should not TrackerConsole.log', () => {
    const tracker = new Tracker({ applicationId: 'test' });
    initializeTransport(new LogTransport(), tracker);
    expect(MockConsoleImplementation.log).not.toHaveBeenCalled();
  });

  it('should not TrackerConsole.error', async () => {
    const mockReactNativeTracker = new Tracker({ applicationId: 'test', platform: TrackerPlatform.REACT_NATIVE });
    initializeTransport(new LogTransport(), mockReactNativeTracker);
    expect(MockConsoleImplementation.error).not.toHaveBeenCalled();
  });

  it('should not TrackerConsole.warn', async () => {
    const tracker = new Tracker({ applicationId: 'test', anonymous: true });
    initializeTransport(new LogTransport(), tracker);
    expect(MockConsoleImplementation.warn).not.toHaveBeenCalled();
  });
});
