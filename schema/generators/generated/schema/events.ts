/*
 * Copyright 2022 Objectiv B.V.
 */

import { AbstractEvent, AbstractLocationContext } from './abstracts';
/**
* A NonInteractive event that is emitted after an application (e.g. SPA) has finished loading.
*/
export interface ApplicationLoadedEvent extends NonInteractiveEvent {
  /**
  * A string literal used during serialization. Hardcoded to the Event name.
  */
  _type: 'ApplicationLoadedEvent';
}

/**
* A NonInteractiveEvent that is sent when a user action results in an error, 
* like an invalid email when sending a form.
*/
export interface FailureEvent extends NonInteractiveEvent {
  /**
  * A string literal used during serialization. Hardcoded to the Event name.
  */
  _type: 'FailureEvent';
  /**
  * Failure message.
  */
  message: string;
}

/**
* A NonInteractiveEvent that's emitted after a LocationContext has become invisible.
*/
export interface HiddenEvent extends NonInteractiveEvent {
  /**
  * A string literal used during serialization. Hardcoded to the Event name.
  */
  _type: 'HiddenEvent';
}

/**
* Event triggered when user input is modified.
*/
export interface InputChangeEvent extends InteractiveEvent {
  /**
  * A string literal used during serialization. Hardcoded to the Event name.
  */
  _type: 'InputChangeEvent';
}

/**
* The parent of Events that are the direct result of a user interaction, e.g. a button click.
*/
export interface InteractiveEvent extends AbstractEvent {
  /**
  * A string literal used during serialization. Hardcoded to the Event name.
  */
  _type: 
    | 'InteractiveEvent'
    | 'InputChangeEvent'
    | 'PressEvent';
  /**
  * An internal discriminator relating entities of the same hierarchical branch.
  */
  __interactive_event: true;
}

/**
* The parent of non-interactive events that are triggered by a media player. 
* It requires a MediaPlayerContext to detail the origin of the event.
*/
export interface MediaEvent extends NonInteractiveEvent {
  /**
  * A string literal used during serialization. Hardcoded to the Event name.
  */
  _type: 
    | 'MediaEvent'
    | 'MediaLoadEvent'
    | 'MediaPauseEvent'
    | 'MediaStartEvent'
    | 'MediaStopEvent';
  /**
  * An internal discriminator relating entities of the same hierarchical branch.
  */
  __media_event: true;
}

/**
* A MediaEvent that's emitted after a media item completes loading.
*/
export interface MediaLoadEvent extends MediaEvent {
  /**
  * A string literal used during serialization. Hardcoded to the Event name.
  */
  _type: 'MediaLoadEvent';
}

/**
* A MediaEvent that's emitted after a media item pauses playback.
*/
export interface MediaPauseEvent extends MediaEvent {
  /**
  * A string literal used during serialization. Hardcoded to the Event name.
  */
  _type: 'MediaPauseEvent';
}

/**
* A MediaEvent that's emitted after a media item starts playback.
*/
export interface MediaStartEvent extends MediaEvent {
  /**
  * A string literal used during serialization. Hardcoded to the Event name.
  */
  _type: 'MediaStartEvent';
}

/**
* A MediaEvent that's emitted after a media item stops playback.
*/
export interface MediaStopEvent extends MediaEvent {
  /**
  * A string literal used during serialization. Hardcoded to the Event name.
  */
  _type: 'MediaStopEvent';
}

/**
* The parent of Events that are not directly triggered by a user action.
*/
export interface NonInteractiveEvent extends AbstractEvent {
  /**
  * A string literal used during serialization. Hardcoded to the Event name.
  */
  _type: 
    | 'NonInteractiveEvent'
    | 'ApplicationLoadedEvent'
    | 'FailureEvent'
    | 'HiddenEvent'
    | 'MediaEvent'
    | 'SuccessEvent'
    | 'VisibleEvent'
    | 'MediaLoadEvent'
    | 'MediaPauseEvent'
    | 'MediaStartEvent'
    | 'MediaStopEvent';
  /**
  * An internal discriminator relating entities of the same hierarchical branch.
  */
  __non_interactive_event: true;
}

/**
* An InteractiveEvent that is sent when a user presses on a pressable element 
* (like a link, button, icon).
*/
export interface PressEvent extends InteractiveEvent {
  /**
  * A string literal used during serialization. Hardcoded to the Event name.
  */
  _type: 'PressEvent';
}

/**
* A NonInteractiveEvent that is sent when a user action is successfully completed, 
* like sending an email form.
*/
export interface SuccessEvent extends NonInteractiveEvent {
  /**
  * A string literal used during serialization. Hardcoded to the Event name.
  */
  _type: 'SuccessEvent';
  /**
  * Success message.
  */
  message: string;
}

/**
* A NonInteractiveEvent that's emitted after a section LocationContext has become visible.
*/
export interface VisibleEvent extends NonInteractiveEvent {
  /**
  * A string literal used during serialization. Hardcoded to the Event name.
  */
  _type: 'VisibleEvent';
}

