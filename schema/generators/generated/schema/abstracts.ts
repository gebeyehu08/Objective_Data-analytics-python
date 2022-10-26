/*
 * Copyright 2022 Objectiv B.V.
 */

/**
* AbstractContext defines the bare minimum properties for every Context. All Contexts inherit from it.
*/
export interface AbstractContext {
  /**
  * An internal unique identifier used to compare instances with the same _type & id.
  */
  __instance_id: string;
  /**
  * An ordered list of the parents of this Context, itself included as the last element.
  */
  _types: Array<string>;
  /**
  * A unique string identifier to be combined with the Context Type (`_type`) 
  * for Context instance uniqueness.
  */
  id: string;
  /**
  * A string literal used during serialization. Hardcoded to the Context name.
  */
  _type: 
    | 'AbstractGlobalContext'
    | 'AbstractLocationContext'
    | 'ApplicationContext'
    | 'CookieIdContext'
    | 'HttpContext'
    | 'IdentityContext'
    | 'InputValueContext'
    | 'LocaleContext'
    | 'MarketingContext'
    | 'PathContext'
    | 'SessionContext'
    | 'ContentContext'
    | 'ExpandableContext'
    | 'InputContext'
    | 'MediaPlayerContext'
    | 'NavigationContext'
    | 'OverlayContext'
    | 'PressableContext'
    | 'RootLocationContext'
    | 'LinkContext';
}

/**
* The abstract parent of all Events.
*/
export interface AbstractEvent {
  /**
  * The version of the Objectiv Taxonomy Schema used to generate this event.
  */
  _schema_version?: string;
  /**
  * An ordered list of the parents of this Event, itself included as the last element.
  */
  _types: Array<string>;
  /**
  * The location stack is an ordered list (stack), that contains a hierarchy of location contexts that 
  * deterministically describes where an event took place from global to specific. 
  * The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
  */
  location_stack: Array<AbstractLocationContext>;
  /**
  * Global contexts add global / general information about the event. They carry information that is not
  * related to where the Event originated (location), such as device, platform or business data.
  */
  global_contexts: Array<AbstractGlobalContext>;
  /**
  * A string literal used during serialization. Hardcoded to the Event name.
  */
  _type: 
    | 'InteractiveEvent'
    | 'NonInteractiveEvent'
    | 'InputChangeEvent'
    | 'PressEvent'
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
  * Unique identifier for a specific instance of an event.
  */
  id: string;
  /**
  * Timestamp indicating when the event was generated.
  */
  time: number;
}

/**
* The abstract parent of all Global Contexts. Global Contexts capture general data for an Event, such
* as user identity & marketing info.
*/
export interface AbstractGlobalContext extends AbstractContext {
  /**
  * An internal discriminator relating entities of the same hierarchical branch.
  */
  __global_context: true;
}

/**
* The abstract parent of all Location Contexts. Location Contexts describe the exact position in an
* application's UI from where an Event was triggered. A location stack is composed of a hierarchical
* stack of LocationContexts; the order defines the hierarchy.
*/
export interface AbstractLocationContext extends AbstractContext {
  /**
  * An internal discriminator relating entities of the same hierarchical branch.
  */
  __location_context: true;
}

