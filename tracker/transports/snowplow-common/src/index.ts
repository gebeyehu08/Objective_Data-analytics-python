/*
 * Copyright 2022 Objectiv B.V.
 */

import { TrackerPlatform } from '@objectiv/tracker-core';

/**
 * Some global constants used to compose iglu schema strings
 */
export const GLOBAL_CONTEXT_SCHEMA_BASE = 'iglu:io.objectiv.context';
export const LOCATION_STACK_SCHEMA_BASE = 'iglu:io.objectiv/location_stack';

/**
 * An array of the TrackerPlatforms this Transport plugin supports
 */
export const SUPPORTED_PLATFORMS = [
  TrackerPlatform.ANGULAR,
  TrackerPlatform.BROWSER,
  TrackerPlatform.CORE,
  TrackerPlatform.REACT,
];

export * from './initializeTransport';
export * from './makeSnowplowContexts';
export * from './makeSnowplowStructuredEvent';
