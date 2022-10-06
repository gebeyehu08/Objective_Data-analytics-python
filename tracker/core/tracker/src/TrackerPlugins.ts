/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { ContextsConfig } from './Context';
import { TrackerInterface } from './Tracker';
import { TrackerEvent } from './TrackerEvent';
import { TrackerPluginInterface } from './TrackerPluginInterface';
import { TrackerPluginLifecycleInterface } from './TrackerPluginLifecycleInterface';
import { TrackerValidationLifecycleInterface } from './TrackerValidationLifecycleInterface';

/**
 * TrackerPlugins is a helper class to execute plugin lifecycle methods in bulk.
 */
export class TrackerPlugins implements TrackerPluginLifecycleInterface, TrackerValidationLifecycleInterface {
  plugins: TrackerPluginInterface[] = [];

  /**
   * Initializes state with the given list of plugins
   */
  constructor(plugins: TrackerPluginInterface[]) {
    this.plugins = plugins;
  }

  /**
   * Calls each Plugin's `initialize` callback function, if defined.
   */
  initialize(tracker: TrackerInterface): void {
    this.plugins.forEach((plugin) => plugin.isUsable() && plugin.initialize && plugin.initialize(tracker));
  }

  /**
   * Calls each Plugin's `enrich` callback function, if defined.
   */
  enrich(contexts: Required<ContextsConfig>): void {
    this.plugins.forEach((plugin) => plugin.isUsable() && plugin.enrich && plugin.enrich(contexts));
  }

  /**
   * Calls each Plugin's `validate` callback function, if defined.
   */
  validate(event: TrackerEvent): void {
    this.plugins.forEach((plugin) => plugin.isUsable() && plugin.validate && plugin.validate(event));
  }
}
