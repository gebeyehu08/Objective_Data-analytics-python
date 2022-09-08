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
import { defaultXHRFunction } from './defaultXHRFunction';

/**
 * The configuration of the XHRTransport class
 */
export type XHRTransportConfig = {
  /**
   * Optional. Override the default XMLHttpRequestFunction implementation with a custom one.
   */
  xmlHttpRequestFunction?: typeof defaultXHRFunction;
};

/**
 * A TrackerTransport based on XMLHttpRequest. Sends event to the specified Collector endpoint.
 * Optionally supports specifying a custom `xmlHttpRequestFunction`.
 */
export class XHRTransport implements TrackerTransportInterface {
  readonly transportName = 'XHRTransport';
  xmlHttpRequestFunction: typeof defaultXHRFunction = defaultXHRFunction;
  endpoint?: string;

  initialize(tracker: TrackerInterface) {
    this.endpoint = tracker.endpoint;
  }

  async handle(...args: NonEmptyArray<TransportableEvent>): Promise<any> {
    const events = await Promise.all(args);

    if (this.endpoint && isNonEmptyArray(events)) {
      return this.xmlHttpRequestFunction({ endpoint: this.endpoint, events });
    }
  }

  isUsable(): boolean {
    return typeof XMLHttpRequest !== 'undefined';
  }
}
