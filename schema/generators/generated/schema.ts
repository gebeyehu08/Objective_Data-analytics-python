/*
 * Copyright 2022 Objectiv B.V.
 */

/**
* AbstractContext defines the bare minimum properties for every Context. All Contexts inherit from it.
*/
export interface AbstractContext {
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
  _type: 'AbstractGlobalContext' | 'AbstractLocationContext';
}

/**
* This is the abstract parent of all Events.
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
  location_stack: LocationStack;
  /**
  * Global contexts add global / general information about the event. They carry information that is not
  * related to where the Event originated (location), such as device, platform or business data.
  */
  global_contexts: GlobalContexts;
  /**
  * A string literal used during serialization. Hardcoded to the Event name.
  */
  _type: 'InteractiveEvent' | 'NonInteractiveEvent';
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
* This is the abstract parent of all Global Contexts. Global contexts add general information to an
* Event.
*/
export interface AbstractGlobalContext extends AbstractContext {
}

/**
* AbstractLocationContext are the abstract parents of all Location Contexts.
* Location Contexts are meant to describe where an event originated from in the visual UI.
*/
export interface AbstractLocationContext extends AbstractContext {
}

/**
* Global contexts add global / general information about the event. They carry information that is not
* related to where the Event originated (location), such as device, platform or business data.
*/
export interface GlobalContexts {
}

/**
* The location stack is an ordered list (stack), that contains a hierarchy of location contexts that 
* deterministically describes where an event took place from global to specific. 
* The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
*/
export interface LocationStack {
}

