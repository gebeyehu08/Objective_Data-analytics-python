/*
 * Copyright 2022 Objectiv B.V.
 */

/**
 * Set package version in globals
 */
import pkg from '../package.json';
globalThis.objectiv = globalThis.objectiv ?? {};
globalThis.objectiv.versions = globalThis.objectiv.versions ?? new Map();
globalThis.objectiv.versions.set(pkg.name, pkg.version);

declare global {
  interface Window {
    snowplow: (method: 'trackStructEvent', event: unknown) => void;
  }
}

export const GLOBAL_CONTEXT_SCHEMA_BASE = 'iglu:io.objectiv.context';
export const LOCATION_STACK_SCHEMA_BASE = 'iglu:io.objectiv/location_stack';

export * from './makeSnowplowContexts';
export * from './SnowplowTransport';
