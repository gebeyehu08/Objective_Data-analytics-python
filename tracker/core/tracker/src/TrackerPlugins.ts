/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { ContextsConfig } from './Context';
import { isValidIndex } from './helpers';
import { TrackerConsole } from './TrackerConsole';
import { TrackerPluginConfig, TrackerPluginInterface } from './TrackerPluginInterface';
import { TrackerPluginLifecycleInterface } from './TrackerPluginLifecycleInterface';

/**
 * TrackerPlugins can be specified by instance, name or even on the fly as Objects.
 *
 * @example
 *
 *  Given a hypothetical PluginA:
 *
 *    class PluginA implements TrackerPlugin {
 *      readonly pluginName = 'pluginA';
 *      readonly parameter?: string;
 *
 *      constructor(args?: { parameter?: string }) {
 *        this.parameter = args?.parameter;
 *      }
 *
 *      isUsable() {
 *        return true;
 *      }
 *    }
 *
 *  And its factory:
 *
 *    const PluginAFactory = (parameter: string) => new PluginA({ parameter });
 *
 *  These would be all valid ways of adding it to the Plugins list:
 *
 *    PluginA
 *    new PluginA()
 *    new PluginA({ parameter: 'parameterValue' })
 *    PluginAFactory('parameterValue')
 *
 *  And it's also possible to define a Plugin on the fly as an Object:
 *
 *    {
 *      pluginName: 'pluginA',
 *      parameter: 'parameterValue',
 *      isUsable: () => true
 *    } as TrackerPlugin
 *
 */
export type TrackerPluginsConfiguration = TrackerPluginConfig & {
  plugins: TrackerPluginInterface[];
};

/**
 * TrackerPlugins is responsible for constructing TrackerPlugin instances and orchestrating their callbacks.
 * It also makes sure to check if Plugins are usable, before executing their callbacks.
 *
 * @note plugin order matters, as they are executed sequentially, a plugin executed later has access to previous
 * Plugins mutations. For example a plugin meant to access the finalized version of the TrackerEvent should be placed
 * at the bottom of the list.
 */
export class TrackerPlugins implements TrackerPluginLifecycleInterface {
  readonly console?: TrackerConsole;
  plugins: TrackerPluginInterface[] = [];

  /**
   * Plugins can be lazy. Map through them to instantiate them.
   */
  constructor(trackerPluginsConfig: TrackerPluginsConfiguration) {
    this.console = trackerPluginsConfig.console;

    trackerPluginsConfig.plugins.map((plugin) => this.add(plugin));

    if (this.console) {
      this.console.groupCollapsed(`｢objectiv:TrackerPlugins｣ Initialized`);
      this.console.group(`Plugins:`);
      this.console.log(this.plugins.map((plugin) => plugin.pluginName).join(', '));
      this.console.groupEnd();
      this.console.groupEnd();
    }
  }

  /**
   * Gets a Plugin instance by its name. Returns null if the plugin is not found.
   */
  get(pluginName: string): TrackerPluginInterface | false {
    return this.plugins.find((plugin) => plugin.pluginName === pluginName) ?? false;
  }

  /**
   * Adds a new Plugin at the end of the plugins list, or at the specified index.
   */
  add(plugin: TrackerPluginInterface, index?: number): boolean {
    if (index !== undefined && !isValidIndex(index)) {
      if (this.console) {
        this.console.error(`｢objectiv:TrackerPlugins｣ invalid index.`);
      }
      return false;
    }

    const pluginInstance = this.get(plugin.pluginName);

    if (pluginInstance) {
      if (this.console) {
        this.console.error(`｢objectiv:TrackerPlugins｣ ${plugin.pluginName}: already exists. Use "replace" instead.`);
      }

      return false;
    }

    // TODO create plugins if they are functions or tuples or strings

    this.plugins.splice(index !== undefined ? index : this.plugins.length, 0, plugin);

    return true;
  }

  /**
   * Removes a Plugin by its name.
   */
  remove(pluginName: string): boolean {
    const pluginInstance = this.get(pluginName);

    if (!pluginInstance) {
      if (this.console) {
        this.console.error(`｢objectiv:TrackerPlugins｣ ${pluginName}: not found.`);
      }

      return false;
    }

    this.plugins = this.plugins.filter(({ pluginName }) => pluginName !== pluginInstance.pluginName);

    return true;
  }

  /**
   * Replaces a plugin with a new one of the same type at the same index, unless a new index has been specified.
   */
  replace(plugin: TrackerPluginInterface, index?: number): boolean {
    if (index !== undefined && !isValidIndex(index)) {
      if (this.console) {
        this.console.error(`｢objectiv:TrackerPlugins｣ invalid index.`);
      }
      return false;
    }

    const originalIndex = this.plugins.findIndex(({ pluginName }) => pluginName === plugin.pluginName);

    if (!this.remove(plugin.pluginName)) {
      return false;
    }

    this.add(plugin, index !== undefined ? index : originalIndex);

    return true;
  }

  /**
   * Calls each Plugin's `initialize` callback function, if defined
   */
  initialize(contexts: Required<ContextsConfig>): void {
    this.plugins.forEach((plugin) => plugin.isUsable() && plugin.initialize && plugin.initialize(contexts));
  }

  /**
   * Calls each Plugin's `beforeTransport` callback function, if defined
   */
  beforeTransport(contexts: Required<ContextsConfig>): void {
    this.plugins.forEach((plugin) => plugin.isUsable() && plugin.beforeTransport && plugin.beforeTransport(contexts));
  }
}
