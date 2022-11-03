/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import {
  AbstractEvent,
  AbstractGlobalContext,
  AbstractLocationContext,
  Contexts,
  EventAbstractDiscriminators,
} from '@objectiv/schema';
import { cleanObjectFromInternalProperties } from './cleanObjectFromInternalProperties';
import { ContextsConfig } from './Context';

/**
 * TrackerEvents can be constructed with the result of one of the Event factories.
 */
export type TrackerEventAttributes = Omit<TrackerEvent, 'toJSON' | '_schema_version'> & {
  // This is necessary exclusively for backwards compatibility with older events that did not have _schema_version
  _schema_version?: string
};

/**
 * The configuration object accepted by TrackerEvent's constructor
 * */
export type TrackerEventConfig = AbstractEvent & ContextsConfig;

/**
 * Our main TrackedEvent interface and basic implementation.
 */
export class TrackerEvent implements AbstractEvent, Contexts {
  readonly __instance_id: AbstractEvent['__instance_id'];
  readonly _type: AbstractEvent['_type'];
  readonly _types: string[];
  readonly _schema_version: string;
  readonly id: string;
  readonly time: number;
  readonly location_stack: AbstractLocationContext[];
  readonly global_contexts: AbstractGlobalContext[];

  /**
   * Configures the TrackerEvent instance via a TrackerEvent or TrackerEventConfig.
   * Optionally one or more ContextConfig can be specified as additional parameters.
   *
   * ContextConfigs are used to configure location_stack and global_contexts. If multiple configurations have been
   * provided they will be merged onto each other to produce a single location_stack and global_contexts.
   */
  constructor(
    { __instance_id, _type, _types, _schema_version, id, time, ...otherProps }: TrackerEventConfig,
    ...contextConfigs: ContextsConfig[]
  ) {
    this.__instance_id = __instance_id;
    this._type = _type;
    this._types = _types;
    this._schema_version = _schema_version ?? '1.0.0';
    this.id = id;
    this.time = time;

    // Let's also set all the other props in state, this includes discriminatory properties and other internals
    Object.assign(this, otherProps);

    // Start with empty context lists
    let new_location_stack: AbstractLocationContext[] = [];
    let new_global_contexts: AbstractGlobalContext[] = [];

    // Process ContextConfigs first. Same order as they have been passed
    contextConfigs.forEach(({ location_stack, global_contexts }) => {
      new_location_stack = [...new_location_stack, ...(location_stack ?? [])];
      new_global_contexts = [...new_global_contexts, ...(global_contexts ?? [])];
    });

    // And finally add the TrackerEvent Contexts on top. For Global Contexts instead we do the opposite.
    this.location_stack = [...new_location_stack, ...(otherProps.location_stack ?? [])];
    this.global_contexts = [...(otherProps.global_contexts ?? []), ...new_global_contexts];
  }

  /**
   * Custom JSON serializer that cleans up the internally properties we use internally to differentiate between
   * Contexts and Event types and for validation. This ensures the Event we send to Collectors has only OSF properties.
   */
  toJSON() {
    return {
      ...cleanObjectFromInternalProperties(this),
      location_stack: this.location_stack.map(cleanObjectFromInternalProperties),
      global_contexts: this.global_contexts.map(cleanObjectFromInternalProperties),
    };
  }
}

/**
 * An Event ready to be validated.
 */
export type EventToValidate = TrackerEvent & EventAbstractDiscriminators;
