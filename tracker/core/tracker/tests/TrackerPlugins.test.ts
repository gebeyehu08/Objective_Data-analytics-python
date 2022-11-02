/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { makePressEvent } from '@objectiv/schema';
import { MockConsoleImplementation } from '@objectiv/testing-tools';
import { TrackerEvent, TrackerPluginInterface, TrackerPlugins } from '../src';

require('@objectiv/developer-tools');
globalThis.objectiv.devTools?.TrackerConsole.setImplementation(MockConsoleImplementation);

describe('Plugin', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should instantiate when specifying an empty list of Plugins', () => {
    const testPlugins = new TrackerPlugins([]);
    expect(testPlugins).toBeInstanceOf(TrackerPlugins);
    expect(testPlugins).toEqual({ plugins: [] });
  });

  it('should instantiate when specifying a list of Plugins instances', () => {
    const plugins: TrackerPluginInterface[] = [
      { pluginName: 'test-pluginA', isUsable: () => true },
      { pluginName: 'test-pluginB', isUsable: () => true },
    ];
    const testPlugins = new TrackerPlugins(plugins);
    expect(testPlugins).toBeInstanceOf(TrackerPlugins);
    expect(testPlugins).toEqual({ plugins });
  });

  it('should execute all Plugins implementing the `enrich` callback', () => {
    const pluginA: TrackerPluginInterface = {
      pluginName: 'pluginA',
      isUsable: () => true,
      enrich: jest.fn(),
    };
    const pluginB: TrackerPluginInterface = {
      pluginName: 'pluginB',
      isUsable: () => true,
      enrich: jest.fn(),
    };
    const pluginC: TrackerPluginInterface = { pluginName: 'pluginC', isUsable: () => true };
    const plugins: TrackerPluginInterface[] = [pluginA, pluginB, pluginC];
    const testPlugins = new TrackerPlugins(plugins);
    expect(pluginA.enrich).not.toHaveBeenCalled();
    expect(pluginB.enrich).not.toHaveBeenCalled();
    const testEvent = new TrackerEvent(makePressEvent());
    testPlugins.enrich(testEvent);
    expect(pluginA.enrich).toHaveBeenCalledWith(testEvent);
    expect(pluginB.enrich).toHaveBeenCalledWith(testEvent);
  });

  it('should execute all Plugins implementing the `validate` callback', () => {
    const pluginA: TrackerPluginInterface = {
      pluginName: 'pluginA',
      isUsable: () => true,
      validate: jest.fn(),
    };
    const pluginB: TrackerPluginInterface = {
      pluginName: 'pluginB',
      isUsable: () => true,
      validate: jest.fn(),
    };
    const pluginC: TrackerPluginInterface = { pluginName: 'pluginC', isUsable: () => true };
    const plugins: TrackerPluginInterface[] = [pluginA, pluginB, pluginC];
    const testPlugins = new TrackerPlugins(plugins);
    expect(pluginA.validate).not.toHaveBeenCalled();
    expect(pluginB.validate).not.toHaveBeenCalled();
    const testEvent = new TrackerEvent(makePressEvent());
    testPlugins.validate(testEvent);
    expect(pluginA.validate).toHaveBeenCalledWith(testEvent);
    expect(pluginB.validate).toHaveBeenCalledWith(testEvent);
  });

  it('should execute only Plugins that are usable', () => {
    const pluginA: TrackerPluginInterface = {
      pluginName: 'pluginA',
      isUsable: () => true,
      enrich: jest.fn(),
    };
    const pluginB: TrackerPluginInterface = {
      pluginName: 'test-pluginB',
      isUsable: () => false,
      enrich: jest.fn(),
    };
    const pluginC: TrackerPluginInterface = {
      pluginName: 'pluginC',
      isUsable: () => true,
      enrich: jest.fn(),
    };
    const plugins: TrackerPluginInterface[] = [pluginA, pluginB, pluginC];
    const testPlugins = new TrackerPlugins(plugins);
    expect(pluginA.enrich).not.toHaveBeenCalled();
    expect(pluginB.enrich).not.toHaveBeenCalled();
    expect(pluginC.enrich).not.toHaveBeenCalled();
    const testEvent = new TrackerEvent(makePressEvent());
    testPlugins.enrich(testEvent);
    expect(pluginA.enrich).toHaveBeenCalledWith(testEvent);
    expect(pluginB.enrich).not.toHaveBeenCalled();
    expect(pluginC.enrich).toHaveBeenCalledWith(testEvent);
  });
});
