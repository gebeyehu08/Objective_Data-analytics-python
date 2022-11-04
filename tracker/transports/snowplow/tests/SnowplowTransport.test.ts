/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import {
  makeApplicationContext,
  makeContentContext,
  makePathContext,
  makePressEvent,
  makeRootLocationContext,
} from '@objectiv/schema';
import { MockConsoleImplementation } from '@objectiv/testing-tools';
import { Tracker, TrackerEvent, TrackerPlatform } from '@objectiv/tracker-core';
import { SnowplowTransport } from '../src';

require('@objectiv/developer-tools');
globalThis.objectiv.devTools?.TrackerConsole.setImplementation(MockConsoleImplementation);

window.snowplow = jest.fn();

afterEach(() => {
  jest.resetAllMocks();
});

describe('SnowplowTransport', () => {
  const testEvent = new TrackerEvent(
    makePressEvent({
      location_stack: [makeRootLocationContext({ id: 'test' }), makeContentContext({ id: 'test' })],
      global_contexts: [makeApplicationContext({ id: 'test' }), makePathContext({ id: 'test' })],
    })
  );

  it('should not be usable when the Tracker platform is not supported', async () => {
    const testTransport = new SnowplowTransport();
    const mockReactNativeTracker = new Tracker({ applicationId: 'test', platform: TrackerPlatform.REACT_NATIVE });
    testTransport.initialize(mockReactNativeTracker);
    expect(testTransport.isUsable()).toBe(false);
    expect(MockConsoleImplementation.error).toHaveBeenCalledWith(
      '%c｢objectiv:SnowplowTransport｣ This transport is not compatible with REACT_NATIVE.',
      'font-weight: bold'
    );
  });

  it('should warn about anonymous mode not being supported', async () => {
    const testTransport = new SnowplowTransport();
    const tracker = new Tracker({ applicationId: 'test', anonymous: true });
    testTransport.initialize(tracker);
    expect(testTransport.isUsable()).toBe(true);
    expect(MockConsoleImplementation.warn).toHaveBeenCalledWith(
      '%c｢objectiv:SnowplowTransport｣ Tracker `anonymous` option is not supported. Anonymous tracking should be configured in Snowplow. Check this blog post for more info: https://snowplow.io/blog/cookieless-and-anonymous-tracking-with-snowplow/',
      'font-weight: bold'
    );
  });

  it('should not be usable when the Transport has not been initialized', async () => {
    const testTransport = new SnowplowTransport();
    expect(testTransport.isUsable()).toBe(false);
  });

  it('should send using Snowplow `trackStructEvent`', async () => {
    const testTransport = new SnowplowTransport();
    testTransport.initialize(new Tracker({ applicationId: 'test' }));

    expect(testTransport.isUsable()).toBe(true);

    await testTransport.handle(testEvent);

    expect(window.snowplow).toHaveBeenCalledTimes(1);
    expect(window.snowplow).toHaveBeenCalledWith('trackStructEvent', {
      action: 'PressEvent',
      category: '["AbstractEvent","InteractiveEvent","PressEvent"]',
      property: testEvent.id,
      context: [
        {
          data: {
            _types: ['AbstractContext', 'AbstractGlobalContext', 'ApplicationContext'],
            id: 'test',
          },
          schema: 'iglu:io.objectiv.context/ApplicationContext/jsonschema/1-0-0',
        },
        {
          data: {
            _types: ['AbstractContext', 'AbstractGlobalContext', 'PathContext'],
            id: 'test',
          },
          schema: 'iglu:io.objectiv.context/PathContext/jsonschema/1-0-0',
        },
        {
          data: {
            location_stack: [
              {
                _type: 'RootLocationContext',
                _types: ['AbstractContext', 'AbstractLocationContext', 'RootLocationContext'],
                id: 'test',
              },
              {
                _type: 'ContentContext',
                _types: ['AbstractContext', 'AbstractLocationContext', 'ContentContext'],
                id: 'test',
              },
            ],
          },
          schema: 'iglu:io.objectiv/location_stack/jsonschema/1-0-0',
        },
      ],
    });
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
    const testTransport = new SnowplowTransport();
    testTransport.initialize(new Tracker({ applicationId: 'test' }));

    expect(MockConsoleImplementation.log).not.toHaveBeenCalled();
  });

  it('should not TrackerConsole.error', async () => {
    const testTransport = new SnowplowTransport();
    const mockReactNativeTracker = new Tracker({ applicationId: 'test', platform: TrackerPlatform.REACT_NATIVE });
    testTransport.initialize(mockReactNativeTracker);
    expect(MockConsoleImplementation.error).not.toHaveBeenCalled();
  });

  it('should not TrackerConsole.warn', async () => {
    const testTransport = new SnowplowTransport();
    const tracker = new Tracker({ applicationId: 'test', anonymous: true });
    testTransport.initialize(tracker);
    expect(MockConsoleImplementation.warn).not.toHaveBeenCalled();
  });
});
