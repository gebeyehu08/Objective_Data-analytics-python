/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { ElementType, ReactHTML } from 'react';

/**
 * Props to specify Component and componentRef to a TrackedContext.
 */
export type TrackedContextComponentProp = {
  /**
   * Either an Element or a JSX tag, such as 'div', 'input', etc.
   */
  Component: ElementType | keyof ReactHTML;
};

/**
 * Props to specify tracking id related options to a TrackedContext.
 */
export type TrackedContextIdProps = {
  /**
   * The identifier of the LocationContext
   */
  id: string;

  /**
   * Optional. Default to `true`. Whether to normalize the given id.
   */
  normalizeId?: boolean;
};

/**
 * Base props of all TrackedContexts.
 */
export type TrackedContextProps<T> = T & {
  objectiv: TrackedContextComponentProp & TrackedContextIdProps;
};

/**
 * Base props of all TrackedElements. They don't include ComponentProp, as we hard-code that for these components.
 */
export type TrackedElementProps<T> = T & {
  objectiv: TrackedContextIdProps;
};

/**
 * The props of Contexts supporting Visibility events. Extends TrackedContextProps with then `isVisible` property.
 */
export type TrackedShowableContextProps<T> = T & {
  objectiv: TrackedContextComponentProp &
    TrackedContextIdProps & {
      /**
       * Whether to track visibility events automatically when this prop changes state.
       */
      isVisible?: boolean;
    };
};

/**
 * The props of TrackedPressableContext. Extends TrackedContextProps with then `isVisible` property.
 */
export type TrackedPressableContextProps<T> = T & {
  objectiv: TrackedContextComponentProp & Partial<TrackedContextIdProps>;
};

/**
 * Overrides TrackedContextProps to not require an id, assuming that semantically there should be only one Element
 */
export type SingletonTrackedElementProps<T> = T & Partial<TrackedContextIdProps>;

/**
 * Some extra options that may be useful for special cases, e.g. anchors without texts or external hrefs.
 * This is mainly used for TrackedContexts and Custom Components.
 *
 * FIXME: do we need this?
 * TODO switch to this way of setting options, as opposed to the current prop merging
 */
export type ObjectivTrackingOptions = {
  /**
   * Whether to block and wait for the Tracker having sent the event, e.g. an external or a full page refresh link.
   */
  waitUntilTracked?: boolean;

  /**
   * The unique id of the LinkContext. Required for links without any title nor text.
   */
  contextId?: string;

  /**
   * Whether to normalize the given id, default to true.
   */
  normalizeId?: boolean;
};
