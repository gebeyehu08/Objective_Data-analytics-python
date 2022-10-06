/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import {
  isNonEmptyArray,
  NonEmptyArray,
  TrackerInterface,
  TrackerTransportInterface,
  TransportableEvent,
} from '@objectiv/tracker-core';
import { defaultFetchFunction } from './defaultFetchFunction';

/**
 * A TrackerTransport based on Fetch API. Sends event to the specified Collector endpoint.
 * Optionally supports specifying a custom `fetchFunction`.
 */
export class FetchTransport implements TrackerTransportInterface {
  readonly transportName = 'FetchTransport';
  fetchFunction: typeof defaultFetchFunction = defaultFetchFunction;
  endpoint?: string;

  initialize(tracker: TrackerInterface) {
    this.endpoint = tracker.endpoint;

    if (globalThis.objectiv.devTools) {
      globalThis.objectiv.devTools.TrackerConsole.groupCollapsed(`｢objectiv:${this.transportName}｣ Initialized`);
      globalThis.objectiv.devTools.TrackerConsole.log(`Endpoint: ${this.endpoint}`);
      globalThis.objectiv.devTools.TrackerConsole.groupEnd();
    }
  }

  async handle(...args: NonEmptyArray<TransportableEvent>): Promise<Response | void> {
    const events = await Promise.all(args);

    if (this.endpoint && isNonEmptyArray(events)) {
      return this.fetchFunction({ endpoint: this.endpoint, events });
    }
  }

  isUsable(): boolean {
    return typeof fetch !== 'undefined';
  }
}
