/*
 * Copyright 2022 Objectiv B.V.
 */

import {
  ApplicationLoadedEvent,
  FailureEvent,
  GlobalContexts,
  HiddenEvent,
  InputChangeEvent,
  InteractiveEvent,
  LocationStack,
  MediaEvent,
  MediaLoadEvent,
  MediaPauseEvent,
  MediaStartEvent,
  MediaStopEvent,
  NonInteractiveEvent,
  PressEvent,
  SuccessEvent,
  VisibleEvent
} from '@objectiv/schema';
import { AbstractEventName, EventName } from './EventNames';
import { generateGUID } from '../helpers';

/**
* A NonInteractive event that is emitted after an application (e.g. SPA) has finished loading.
*/
export const makeApplicationLoadedEvent = (props: {
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): ApplicationLoadedEvent => ({
  __instance_id: generateGUID(),
  __non_interactive_event: true,
  _schema_version: '1.0.0' ?? null,
  _types: [
    AbstractEventName.AbstractEvent,
    EventName.NonInteractiveEvent,
    EventName.ApplicationLoadedEvent
  ],
  location_stack: props.location_stack,
  global_contexts: props.global_contexts,
  _type: EventName.ApplicationLoadedEvent,
  id: props.id,
  time: props.time,
});

/**
* A NonInteractiveEvent that is sent when a user action results in an error, 
* like an invalid email when sending a form.
*/
export const makeFailureEvent = (props: {
  message: string,
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): FailureEvent => ({
  __instance_id: generateGUID(),
  __non_interactive_event: true,
  message: props.message,
  _schema_version: '1.0.0' ?? null,
  _types: [
    AbstractEventName.AbstractEvent,
    EventName.NonInteractiveEvent,
    EventName.FailureEvent
  ],
  location_stack: props.location_stack,
  global_contexts: props.global_contexts,
  _type: EventName.FailureEvent,
  id: props.id,
  time: props.time,
});

/**
* A NonInteractiveEvent that's emitted after a LocationContext has become invisible.
*/
export const makeHiddenEvent = (props: {
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): HiddenEvent => ({
  __instance_id: generateGUID(),
  __non_interactive_event: true,
  _schema_version: '1.0.0' ?? null,
  _types: [
    AbstractEventName.AbstractEvent,
    EventName.NonInteractiveEvent,
    EventName.HiddenEvent
  ],
  location_stack: props.location_stack,
  global_contexts: props.global_contexts,
  _type: EventName.HiddenEvent,
  id: props.id,
  time: props.time,
});

/**
* Event triggered when user input is modified.
*/
export const makeInputChangeEvent = (props: {
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): InputChangeEvent => ({
  __instance_id: generateGUID(),
  __interactive_event: true,
  _schema_version: '1.0.0' ?? null,
  _types: [
    AbstractEventName.AbstractEvent,
    EventName.InteractiveEvent,
    EventName.InputChangeEvent
  ],
  location_stack: props.location_stack,
  global_contexts: props.global_contexts,
  _type: EventName.InputChangeEvent,
  id: props.id,
  time: props.time,
});

/**
* The parent of Events that are the direct result of a user interaction, e.g. a button click.
*/
export const makeInteractiveEvent = (props: {
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): InteractiveEvent => ({
  __instance_id: generateGUID(),
  __interactive_event: true,
  location_stack: props.location_stack,
  _schema_version: '1.0.0' ?? null,
  _types: [
    AbstractEventName.AbstractEvent,
    EventName.InteractiveEvent
  ],
  global_contexts: props.global_contexts,
  _type: EventName.InteractiveEvent,
  id: props.id,
  time: props.time,
});

/**
* The parent of non-interactive events that are triggered by a media player. 
* It requires a MediaPlayerContext to detail the origin of the event.
*/
export const makeMediaEvent = (props: {
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): MediaEvent => ({
  __instance_id: generateGUID(),
  __media_event: true,
  __non_interactive_event: true,
  _schema_version: '1.0.0' ?? null,
  _types: [
    AbstractEventName.AbstractEvent,
    EventName.NonInteractiveEvent,
    EventName.MediaEvent
  ],
  location_stack: props.location_stack,
  global_contexts: props.global_contexts,
  _type: EventName.MediaEvent,
  id: props.id,
  time: props.time,
});

/**
* A MediaEvent that's emitted after a media item completes loading.
*/
export const makeMediaLoadEvent = (props: {
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): MediaLoadEvent => ({
  __instance_id: generateGUID(),
  __non_interactive_event: true,
  __media_event: true,
  _schema_version: '1.0.0' ?? null,
  _types: [
    AbstractEventName.AbstractEvent,
    EventName.NonInteractiveEvent,
    EventName.MediaEvent,
    EventName.MediaLoadEvent
  ],
  location_stack: props.location_stack,
  global_contexts: props.global_contexts,
  _type: EventName.MediaLoadEvent,
  id: props.id,
  time: props.time,
});

/**
* A MediaEvent that's emitted after a media item pauses playback.
*/
export const makeMediaPauseEvent = (props: {
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): MediaPauseEvent => ({
  __instance_id: generateGUID(),
  __non_interactive_event: true,
  __media_event: true,
  _schema_version: '1.0.0' ?? null,
  _types: [
    AbstractEventName.AbstractEvent,
    EventName.NonInteractiveEvent,
    EventName.MediaEvent,
    EventName.MediaPauseEvent
  ],
  location_stack: props.location_stack,
  global_contexts: props.global_contexts,
  _type: EventName.MediaPauseEvent,
  id: props.id,
  time: props.time,
});

/**
* A MediaEvent that's emitted after a media item starts playback.
*/
export const makeMediaStartEvent = (props: {
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): MediaStartEvent => ({
  __instance_id: generateGUID(),
  __non_interactive_event: true,
  __media_event: true,
  _schema_version: '1.0.0' ?? null,
  _types: [
    AbstractEventName.AbstractEvent,
    EventName.NonInteractiveEvent,
    EventName.MediaEvent,
    EventName.MediaStartEvent
  ],
  location_stack: props.location_stack,
  global_contexts: props.global_contexts,
  _type: EventName.MediaStartEvent,
  id: props.id,
  time: props.time,
});

/**
* A MediaEvent that's emitted after a media item stops playback.
*/
export const makeMediaStopEvent = (props: {
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): MediaStopEvent => ({
  __instance_id: generateGUID(),
  __non_interactive_event: true,
  __media_event: true,
  _schema_version: '1.0.0' ?? null,
  _types: [
    AbstractEventName.AbstractEvent,
    EventName.NonInteractiveEvent,
    EventName.MediaEvent,
    EventName.MediaStopEvent
  ],
  location_stack: props.location_stack,
  global_contexts: props.global_contexts,
  _type: EventName.MediaStopEvent,
  id: props.id,
  time: props.time,
});

/**
* The parent of Events that are not directly triggered by a user action.
*/
export const makeNonInteractiveEvent = (props: {
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): NonInteractiveEvent => ({
  __instance_id: generateGUID(),
  __non_interactive_event: true,
  _schema_version: '1.0.0' ?? null,
  _types: [
    AbstractEventName.AbstractEvent,
    EventName.NonInteractiveEvent
  ],
  location_stack: props.location_stack,
  global_contexts: props.global_contexts,
  _type: EventName.NonInteractiveEvent,
  id: props.id,
  time: props.time,
});

/**
* An InteractiveEvent that is sent when a user presses on a pressable element 
* (like a link, button, icon).
*/
export const makePressEvent = (props: {
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): PressEvent => ({
  __instance_id: generateGUID(),
  __interactive_event: true,
  _schema_version: '1.0.0' ?? null,
  _types: [
    AbstractEventName.AbstractEvent,
    EventName.InteractiveEvent,
    EventName.PressEvent
  ],
  location_stack: props.location_stack,
  global_contexts: props.global_contexts,
  _type: EventName.PressEvent,
  id: props.id,
  time: props.time,
});

/**
* A NonInteractiveEvent that is sent when a user action is successfully completed, 
* like sending an email form.
*/
export const makeSuccessEvent = (props: {
  message: string,
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): SuccessEvent => ({
  __instance_id: generateGUID(),
  __non_interactive_event: true,
  message: props.message,
  _schema_version: '1.0.0' ?? null,
  _types: [
    AbstractEventName.AbstractEvent,
    EventName.NonInteractiveEvent,
    EventName.SuccessEvent
  ],
  location_stack: props.location_stack,
  global_contexts: props.global_contexts,
  _type: EventName.SuccessEvent,
  id: props.id,
  time: props.time,
});

/**
* A NonInteractiveEvent that's emitted after a section LocationContext has become visible.
*/
export const makeVisibleEvent = (props: {
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): VisibleEvent => ({
  __instance_id: generateGUID(),
  __non_interactive_event: true,
  _schema_version: '1.0.0' ?? null,
  _types: [
    AbstractEventName.AbstractEvent,
    EventName.NonInteractiveEvent,
    EventName.VisibleEvent
  ],
  location_stack: props.location_stack,
  global_contexts: props.global_contexts,
  _type: EventName.VisibleEvent,
  id: props.id,
  time: props.time,
});

/**
* A factory to generate any Event.
*/
export function makeEvent (eventProps: {
  _type: 'ApplicationLoadedEvent',
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): ApplicationLoadedEvent;

export function makeEvent (eventProps: {
  _type: 'FailureEvent',
  message: string,
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): FailureEvent;

export function makeEvent (eventProps: {
  _type: 'HiddenEvent',
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): HiddenEvent;

export function makeEvent (eventProps: {
  _type: 'InputChangeEvent',
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): InputChangeEvent;

export function makeEvent (eventProps: {
  _type: 'InteractiveEvent',
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): InteractiveEvent;

export function makeEvent (eventProps: {
  _type: 'MediaEvent',
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): MediaEvent;

export function makeEvent (eventProps: {
  _type: 'MediaLoadEvent',
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): MediaLoadEvent;

export function makeEvent (eventProps: {
  _type: 'MediaPauseEvent',
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): MediaPauseEvent;

export function makeEvent (eventProps: {
  _type: 'MediaStartEvent',
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): MediaStartEvent;

export function makeEvent (eventProps: {
  _type: 'MediaStopEvent',
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): MediaStopEvent;

export function makeEvent (eventProps: {
  _type: 'NonInteractiveEvent',
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): NonInteractiveEvent;

export function makeEvent (eventProps: {
  _type: 'PressEvent',
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): PressEvent;

export function makeEvent (eventProps: {
  _type: 'SuccessEvent',
  message: string,
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): SuccessEvent;

export function makeEvent (eventProps: {
  _type: 'VisibleEvent',
  location_stack: LocationStack,
  global_contexts: GlobalContexts,
  id: string,
  time: number,
}): VisibleEvent;

export function makeEvent ({ _type, ...eventProps }: any) {
  switch(_type) {
    case 'ApplicationLoadedEvent':
      return makeApplicationLoadedEvent(eventProps);
    case 'FailureEvent':
      return makeFailureEvent(eventProps);
    case 'HiddenEvent':
      return makeHiddenEvent(eventProps);
    case 'InputChangeEvent':
      return makeInputChangeEvent(eventProps);
    case 'InteractiveEvent':
      return makeInteractiveEvent(eventProps);
    case 'MediaEvent':
      return makeMediaEvent(eventProps);
    case 'MediaLoadEvent':
      return makeMediaLoadEvent(eventProps);
    case 'MediaPauseEvent':
      return makeMediaPauseEvent(eventProps);
    case 'MediaStartEvent':
      return makeMediaStartEvent(eventProps);
    case 'MediaStopEvent':
      return makeMediaStopEvent(eventProps);
    case 'NonInteractiveEvent':
      return makeNonInteractiveEvent(eventProps);
    case 'PressEvent':
      return makePressEvent(eventProps);
    case 'SuccessEvent':
      return makeSuccessEvent(eventProps);
    case 'VisibleEvent':
      return makeVisibleEvent(eventProps);
  }
}
