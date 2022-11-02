/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { makeHiddenEvent } from '@objectiv/schema';
import { EventTrackerParameters } from '../types';

/**
 * Factors a HiddenEvent and hands it over to the given `tracker` via its `trackEvent` method.
 */
export const trackHiddenEvent = ({ tracker, locationStack, globalContexts, options }: EventTrackerParameters) =>
  tracker.trackEvent(makeHiddenEvent({ location_stack: locationStack, global_contexts: globalContexts }), options);
