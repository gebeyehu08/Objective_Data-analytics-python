/*
 * Copyright 2022 Objectiv B.V.
 */

import { ContextsConfig } from './Context';
import { makeSessionContext } from './generated/ContextFactories';
import { TrackerInterface } from './Tracker';
import { TrackerPluginInterface } from './TrackerPluginInterface';

/**
 * The ClientSessionContextPlugin adds a SessionContext as GlobalContext before events are transported.
 * This session is based on the objectiv.clientSessionId global, thus volatile by definition.
 * Developers may persist objectiv.clientSessionId themselves if they want persistent client sessions.
 */
export class ClientSessionContextPlugin implements TrackerPluginInterface {
  anonymous: boolean = false;
  pluginName = 'ClientSessionContextPlugin';

  initialize(tracker: TrackerInterface) {
    this.anonymous = tracker.anonymous;
  }

  enrich(contexts: Required<ContextsConfig>) {
    if (!this.anonymous) {
      return;
    }

    contexts.global_contexts.push(
      makeSessionContext({
        id: objectiv.clientSessionId,
        // FIXME hit_number is deprecated, yet still a required attribute: remove it when the taxonomy gets updated.
        hit_number: 0,
      })
    );
  }

  isUsable() {
    return true;
  }
}
