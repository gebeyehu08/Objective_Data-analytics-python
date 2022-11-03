/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { GlobalContexts, LocationStack } from '@objectiv/schema';

/**
 * The configuration of the Contexts interface
 */
export type ContextsConfig = {
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
};
