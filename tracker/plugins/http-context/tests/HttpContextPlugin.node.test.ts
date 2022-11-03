/*
 * Copyright 2021-2022 Objectiv B.V.
 * @jest-environment node
 */
import { makePressEvent } from '@objectiv/schema';
import { MockConsoleImplementation } from '@objectiv/testing-tools';
import { Tracker, TrackerEvent } from '@objectiv/tracker-core';
import { HttpContextPlugin } from '../src';

require('@objectiv/developer-tools');
globalThis.objectiv.devTools?.TrackerConsole.setImplementation(MockConsoleImplementation);

describe('HttpContextPlugin - node', () => {
  it('should instantiate as unusable', () => {
    const testHttpContextPlugin = new HttpContextPlugin();
    expect(testHttpContextPlugin.isUsable()).toBe(false);
  });

  it('when unusable, should not initialize and log an error message', () => {
    const testHttpContextPlugin = new HttpContextPlugin();
    testHttpContextPlugin.initialize(
      new Tracker({
        applicationId: 'app-id',
        plugins: [new HttpContextPlugin()],
      })
    );
    expect(MockConsoleImplementation.error).toHaveBeenCalledWith(
      '｢objectiv:HttpContextPlugin｣ Cannot initialize. Plugin is not usable (document: undefined, navigator: undefined).'
    );
  });

  it('when unusable, should not validate and log an error message', () => {
    const testHttpContextPlugin = new HttpContextPlugin();
    const testEvent = new TrackerEvent(makePressEvent());
    testHttpContextPlugin.validate(testEvent);
    expect(MockConsoleImplementation.error).toHaveBeenCalledWith(
      '｢objectiv:HttpContextPlugin｣ Cannot validate. Plugin is not usable (document: undefined, navigator: undefined).'
    );
  });

  describe('Without developer tools', () => {
    let objectivGlobal = globalThis.objectiv;

    beforeEach(() => {
      jest.clearAllMocks();
      globalThis.objectiv.devTools = undefined;
    });

    afterEach(() => {
      globalThis.objectiv = objectivGlobal;
    });

    it('when unusable, should not initialize and not log', () => {
      const testHttpContextPlugin = new HttpContextPlugin();
      testHttpContextPlugin.initialize(
        new Tracker({
          applicationId: 'app-id',
          plugins: [],
        })
      );
      expect(MockConsoleImplementation.error).not.toHaveBeenCalled();
    });

    it('when unusable, should not validate and not log', () => {
      const testHttpContextPlugin = new HttpContextPlugin();
      const testEvent = new TrackerEvent(makePressEvent());
      testHttpContextPlugin.validate(testEvent);
      expect(MockConsoleImplementation.error).not.toHaveBeenCalled();
    });
  });
});
