/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import {
  GlobalContextName,
  makeApplicationContext,
  makeContentContext,
  makePathContext,
  makePressEvent,
} from '@objectiv/schema';
import { matchUUID, MockConsoleImplementation } from '@objectiv/testing-tools';
import { ContextsConfig, Tracker, TrackerEvent } from '@objectiv/tracker-core';
import { PathContextFromURLPlugin } from '../src';

require('@objectiv/developer-tools');
globalThis.objectiv.devTools?.TrackerConsole.setImplementation(MockConsoleImplementation);

const testTracker = new Tracker({
  applicationId: 'app-id',
  plugins: [new PathContextFromURLPlugin()],
});

describe('PathContextFromURLPlugin', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should add the PathContext to the Event when `enrich` is executed by the Tracker', async () => {
    const eventContexts: ContextsConfig = {
      location_stack: [makeContentContext({ id: 'A' }), makeContentContext({ id: 'B' })],
      global_contexts: [makePathContext({ id: 'abc' }), makeApplicationContext({ id: 'def' })],
    };
    const testEvent = new TrackerEvent(makePressEvent(eventContexts));
    expect(testEvent.location_stack).toHaveLength(2);
    const trackedEvent = await testTracker.trackEvent(testEvent);
    expect(trackedEvent.location_stack).toHaveLength(2);
    expect(trackedEvent.global_contexts).toHaveLength(3);
    expect(trackedEvent.global_contexts).toEqual(
      expect.arrayContaining([
        {
          __instance_id: matchUUID,
          __global_context: true,
          _type: GlobalContextName.PathContext,
          id: 'http://localhost/',
          _types: ['AbstractContext', 'AbstractGlobalContext', 'PathContext'],
        },
      ])
    );
  });
});
