/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import {
  EventName,
  makeApplicationContext,
  makeContentContext,
  makeMediaLoadEvent,
  makeOverlayContext,
  makePathContext,
  makePressableContext,
  makePressEvent,
  makeRootLocationContext,
} from '@objectiv/schema';
import MockDate from 'mockdate';
import { ContextsConfig, TrackerEvent } from '../src';

const mockedMs = 1434319925275;

beforeEach(() => {
  MockDate.reset();
  MockDate.set(mockedMs);
});

afterEach(() => {
  MockDate.reset();
});

describe('TrackerEvent', () => {
  const testEventName = EventName.PressEvent;
  const testContexts: ContextsConfig = {
    location_stack: [makeContentContext({ id: 'test' })],
    global_contexts: [makePathContext({ id: 'test' })],
  };

  it('should instantiate with the given properties as one Config', () => {
    const testEvent = new TrackerEvent(makePressEvent(testContexts));
    expect(testEvent).toBeInstanceOf(TrackerEvent);
    expect(testEvent._type).toBe(testEventName);
    expect(testEvent.location_stack).toEqual(testContexts.location_stack);
    expect(testEvent.global_contexts).toEqual(testContexts.global_contexts);
  });

  it('should instantiate without _schema_version and default to 1.0.0', () => {
    const pressEvent = makePressEvent(testContexts);
    delete pressEvent._schema_version;
    const testEvent = new TrackerEvent(pressEvent);
    expect(testEvent).toBeInstanceOf(TrackerEvent);
    expect(testEvent._type).toBe(testEventName);
    expect(testEvent._schema_version).toBe('1.0.0');
  });

  it('should instantiate without custom location_stack and global_contexts', () => {
    const {location_stack, global_contexts, ...pressEvent } = makePressEvent();
    // @ts-ignore this happens only when devs don't use TS and make a manual mistake
    const testEvent = new TrackerEvent(pressEvent);
    expect(testEvent).toBeInstanceOf(TrackerEvent);
    expect(testEvent._type).toBe(testEventName);
    expect(testEvent.location_stack).toEqual([]);
    expect(testEvent.global_contexts).toEqual([]);
  });

  it('should instantiate with the given properties as multiple Configs', () => {
    const testEvent = new TrackerEvent(makePressEvent(), testContexts);
    expect(testEvent).toBeInstanceOf(TrackerEvent);
    expect(testEvent._type).toBe(testEventName);
    expect(testEvent.location_stack).toEqual(testContexts.location_stack);
    expect(testEvent.global_contexts).toEqual(testContexts.global_contexts);
  });

  it('should instantiate without location_stack', () => {
    const testEvent = new TrackerEvent(makePressEvent(), { global_contexts: testContexts.global_contexts });
    expect(testEvent).toBeInstanceOf(TrackerEvent);
    expect(testEvent._type).toBe(testEventName);
    expect(testEvent.location_stack).toEqual([]);
    expect(testEvent.global_contexts).toEqual(testContexts.global_contexts);
  });

  it('should instantiate without global_contexts', () => {
    const testEvent = new TrackerEvent(makePressEvent(), { location_stack: testContexts.location_stack });
    expect(testEvent).toBeInstanceOf(TrackerEvent);
    expect(testEvent._type).toBe(testEventName);
    expect(testEvent.location_stack).toEqual(testContexts.location_stack);
    expect(testEvent.global_contexts).toEqual([]);
  });

  it('should allow compositions with multiple configs or instances and produce a valid location_stack', () => {
    const rootContext = makeRootLocationContext({ id: 'root' });
    const contextA = makeContentContext({ id: 'A' });
    const contextB = makeContentContext({ id: 'B' });
    const contextC = makeContentContext({ id: 'C' });
    const contextD = makeContentContext({ id: 'D' });
    const contextX = makePressableContext({ id: 'X' });
    const eventContexts: ContextsConfig = {
      location_stack: [contextD, contextX],
    };
    const sectionContexts1: ContextsConfig = {
      location_stack: [rootContext, contextA],
    };
    const sectionContexts2: ContextsConfig = {
      location_stack: [contextB, contextC],
    };
    const composedEvent = new TrackerEvent(makePressEvent(eventContexts), sectionContexts1, sectionContexts2);
    expect(composedEvent.location_stack).toEqual([rootContext, contextA, contextB, contextC, contextD, contextX]);
  });

  it('should serialize to JSON without internal properties', () => {
    const testEvent = new TrackerEvent(
      makeMediaLoadEvent({
        location_stack: [makeOverlayContext({ id: 'player' })],
        global_contexts: [makeApplicationContext({ id: 'test-app' })],
      })
    );
    const jsonStringEvent = JSON.stringify(testEvent, null, 2);
    expect(jsonStringEvent).toEqual(`{
  "_type": "MediaLoadEvent",
  "_types": [
    "AbstractEvent",
    "NonInteractiveEvent",
    "MediaEvent",
    "MediaLoadEvent"
  ],
  "_schema_version": "1.0.0",
  "id": "${testEvent.id}",
  "time": ${testEvent.time},
  "location_stack": [
    {
      "_types": [
        "AbstractContext",
        "AbstractLocationContext",
        "OverlayContext"
      ],
      "id": "player",
      "_type": "OverlayContext"
    }
  ],
  "global_contexts": [
    {
      "_types": [
        "AbstractContext",
        "AbstractGlobalContext",
        "ApplicationContext"
      ],
      "id": "test-app",
      "_type": "ApplicationContext"
    }
  ]
}`);
  });

  it('should clone without generating a new id', () => {
    const testEvent = new TrackerEvent(makePressEvent());
    expect(testEvent.id).not.toBeUndefined();
    const testEventClone1 = new TrackerEvent(testEvent);
    const testEventClone1_1 = new TrackerEvent(testEventClone1);
    const testEventClone1_2 = new TrackerEvent(testEventClone1_1);
    expect(testEventClone1.id).toBe(testEvent.id);
    expect(testEventClone1_1.id).toBe(testEvent.id);
    expect(testEventClone1_2.id).toBe(testEvent.id);
  });
});
