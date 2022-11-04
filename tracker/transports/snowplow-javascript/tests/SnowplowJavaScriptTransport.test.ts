/*
 * Copyright 2022 Objectiv B.V.
 */

import {
  makeApplicationContext,
  makeContentContext,
  makePathContext,
  makePressEvent,
  makeRootLocationContext,
} from '@objectiv/schema';
import { MockConsoleImplementation } from '@objectiv/testing-tools';
import { Tracker, TrackerEvent } from '@objectiv/tracker-core';
import { SnowplowJavaScriptTransport } from '../src';

require('@objectiv/developer-tools');
globalThis.objectiv.devTools?.TrackerConsole.setImplementation(MockConsoleImplementation);

window.snowplow = jest.fn();

afterEach(() => {
  jest.resetAllMocks();
});

describe('SnowplowJavaScriptTransport', () => {
  const testEvent = new TrackerEvent(
    makePressEvent({
      location_stack: [makeRootLocationContext({ id: 'test' }), makeContentContext({ id: 'test' })],
      global_contexts: [makeApplicationContext({ id: 'test' }), makePathContext({ id: 'test' })],
    })
  );

  it('should send using Snowplow `trackStructEvent`', async () => {
    const testTransport = new SnowplowJavaScriptTransport();
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

describe('SnowplowJavaScriptTransport - Without developer tools', () => {
  let objectivGlobal = globalThis.objectiv;

  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.objectiv.devTools = undefined;
  });

  afterEach(() => {
    globalThis.objectiv = objectivGlobal;
  });

  it('should not TrackerConsole.log', () => {
    const testTransport = new SnowplowJavaScriptTransport();
    testTransport.initialize(new Tracker({ applicationId: 'test' }));

    expect(MockConsoleImplementation.log).not.toHaveBeenCalled();
  });
});
