/*
 * Copyright 2022 Objectiv B.V.
 */

import { TrackerTransportInterface, TrackerTransportRetry } from '@objectiv/tracker-core';
import { FetchTransport } from '@objectiv/transport-fetch';

/**
 * A factory to create the default Transport of React Native Tracker.
 */
export const makeReactNativeTrackerDefaultTransport = (): TrackerTransportInterface =>
  new TrackerTransportRetry({
    transport: new FetchTransport(),
  });
