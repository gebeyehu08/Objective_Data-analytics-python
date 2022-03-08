/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { ContextsConfig, isBrowser, isDevMode, Tracker, TrackerConfig } from '@objectiv/tracker-core';
import { makeBrowserTrackerDefaultPluginsList } from './common/factories/makeBrowserTrackerDefaultPluginsList';
import { makeBrowserTrackerDefaultQueue } from './common/factories/makeBrowserTrackerDefaultQueue';
import { makeBrowserTrackerDefaultTransport } from './common/factories/makeBrowserTrackerDefaultTransport';
import { BrowserTrackerConfig } from './definitions/BrowserTrackerConfig';

/**
 * Browser Tracker is a Tracker Core constructor with simplified parameters and some preconfigured Plugins.
 * It initializes with a Queued Fetch and XMLHttpRequest Transport Switch wrapped in a Retry Transport automatically.
 * The resulting Queue has some sensible defaults (10 events every 100ms) for sending events in batches.
 * The Retry logic is configured for 10 retries with exponential backoff starting at 1000ms.
 *
 * This statement:
 *
 *  const tracker = new BrowserTracker({ applicationId: 'app-id', endpoint: '/endpoint', console: console });
 *
 * is equivalent to:
 *
 *  const trackerId = trackerConfig.trackerId ?? trackerConfig.applicationId;
 *  const console = trackerConfig.console;
 *  const fetchTransport = new FetchTransport({ endpoint: '/endpoint', console });
 *  const xhrTransport = new XHRTransport({ endpoint: '/endpoint', console });
 *  const transportSwitch = new TransportSwitch({ transports: [fetchTransport, xhrTransport], console });
 *  const transport = new RetryTransport({ transport: transportSwitch, console });
 *  const queueStorage = new LocalStorageQueueStore({ trackerId, console })
 *  const trackerQueue = new TrackerQueue({ storage: trackerStorage, console });
 *  const applicationContextPlugin = new ApplicationContextPlugin({ applicationId: 'app-id', console });
 *  const httpContextPlugin = new HttpContextPlugin({ console });
 *  const pathContextFromURLPlugin = new PathContextFromURLPlugin({ console });
 *  const rootLocationContextFromURLPlugin = new RootLocationContextFromURLPlugin({ console });
 *  const plugins = [
 *    applicationContextPlugin,
 *    httpContextPlugin,
 *    pathContextFromURLPlugin,
 *    rootLocationContextFromURLPlugin
 *  ];
 *  const tracker = new Tracker({ transport, queue, plugins, console });
 *
 *  See also `makeDefaultTransport`, `makeDefaultQueue` and
 *  `makeBrowserTrackerDefaultPluginList` for the actual implementation.
 *
 */
export class BrowserTracker extends Tracker {
  // A copy of the original configuration
  readonly trackerConfig: TrackerConfig;

  constructor(trackerConfig: BrowserTrackerConfig, ...contextConfigs: ContextsConfig[]) {
    let config = trackerConfig;

    // Either `transport` or `endpoint` must be provided
    if (!config.transport && !config.endpoint) {
      throw new Error('Either `transport` or `endpoint` must be provided');
    }

    // `transport` and `endpoint` must not be provided together
    if (config.transport && config.endpoint) {
      throw new Error('Please provider either `transport` or `endpoint`, not both at same time');
    }

    // If node is in `development` mode and console has not been configured, automatically use the browser's console
    if (config.console === undefined && isDevMode() && isBrowser()) {
      config.console = console;
    }

    // Automatically create a default Transport for the given `endpoint` with a sensible setup
    if (config.endpoint) {
      config = {
        ...config,
        transport: makeBrowserTrackerDefaultTransport(config),
        queue: config.queue ?? makeBrowserTrackerDefaultQueue(config),
      };
    }

    // Configure to use provided `plugins` or automatically create a Plugins instance with some sensible web defaults
    if (!config.plugins) {
      config = {
        ...config,
        plugins: makeBrowserTrackerDefaultPluginsList(config),
      };
    }

    // Initialize core Tracker
    super(config, ...contextConfigs);

    // Store original config for comparison with other instances of Browser Tracker
    this.trackerConfig = trackerConfig;
  }
}
