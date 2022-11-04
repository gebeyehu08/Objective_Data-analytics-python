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
import { TrackerEvent } from '@objectiv/tracker-core';
import { makeSnowplowStructuredEvent } from '../src';

describe('makeSnowplowStructuredEvent', () => {
  const testEvent = new TrackerEvent(
    makePressEvent({
      location_stack: [makeRootLocationContext({ id: 'test' }), makeContentContext({ id: 'test' })],
      global_contexts: [makeApplicationContext({ id: 'test' }), makePathContext({ id: 'test' })],
    })
  );

  it("should convert the Event from Objectiv to Snowplows' format", async () => {
    expect(makeSnowplowStructuredEvent(testEvent)).toStrictEqual({
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
