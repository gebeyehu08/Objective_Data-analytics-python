/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { TrackerTransportInterface, TrackerTransportRetry, TrackerTransportSwitch } from '@objectiv/tracker-core';
import { FetchTransport } from '@objectiv/transport-fetch';
import { XHRTransport } from '@objectiv/transport-xhr';

/**
 * A factory to create the default Transport of React Tracker.
 */
export const makeReactTrackerDefaultTransport = (): TrackerTransportInterface =>
  new TrackerTransportRetry({
    transport: new TrackerTransportSwitch({
      transports: [new FetchTransport(), new XHRTransport()],
    }),
  });
