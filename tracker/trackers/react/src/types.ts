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
export type TrackedContextProps<P extends unknown> = P & {
  objectiv: TrackedContextComponentProp & TrackedContextIdProps;
};

/**
 * Base props of all TrackedElements. They don't include ComponentAndComponentRefProps props, as we hard-code those.
 */
export type TrackedElementProps<P> = P & {
  objectiv: TrackedContextIdProps;
};

/**
 * The props of Contexts supporting Visibility events. Extends TrackedContextProps with then `isVisible` property.
 */
export type TrackedShowableContextProps<P, R> = TrackedContextProps<P, R> & {
  /**
   * Whether to track visibility events automatically when this prop changes state.
   */
  isVisible?: boolean;
};

/**
 * The props of TrackedPressableContext. Extends TrackedContextProps with then `isVisible` property.
 */
export type TrackedPressableContextProps<P, R> = Omit<TrackedContextProps<P, R>, 'id'> & {
  /**
   * The unique id of the LocationContext. Optional because we will attempt to auto-detect it.
   */
  id?: string;

  /**
   * The title is used to generate a unique identifier. Optional because we will attempt to auto-detect it.
   */
  title?: string;

  /**
   * Whether to forward the given title to the given Component.
   */
  forwardTitle?: boolean;
};

/**
 * Overrides TrackedContextProps to not require an id, assuming that semantically there should be only one Element
 */
export type SingletonTrackedElementProps<P, R> = Omit<TrackedContextProps<P, R>, 'Component' | 'id'> & {
  /**
   * Optional identifier to be provided only in case of uniqueness collisions, defaults to 'footer'
   */
  id?: string;
};

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
