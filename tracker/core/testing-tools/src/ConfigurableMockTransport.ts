/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { TrackerInterface, TrackerTransportInterface } from '@objectiv/tracker-core';

export class ConfigurableMockTransport implements TrackerTransportInterface {
  readonly transportName = 'ConfigurableMockTransport';
  _isUsable: boolean;

  constructor({ isUsable }: { isUsable: boolean }) {
    this._isUsable = isUsable;
  }

  async initialize(_: TrackerInterface) {
    globalThis.objectiv.devTools?.TrackerConsole.log('MockTransport.initialize');
  }

  async handle(): Promise<any> {
    globalThis.objectiv.devTools?.TrackerConsole.log('MockTransport.handle');
  }

  isUsable(): boolean {
    return this._isUsable;
  }
}
