/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { ComponentProps, ElementType, MouseEventHandler, ReactHTML, ReactNode } from 'react';

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
  id?: string;

  /**
   * Optional. Default to `true`. Whether to normalize the given id.
   */
  normalizeId?: boolean;
};

/**
 * These props allow configuring how values are tracked for TrackedInputContext and derived Tracked Elements.
 */
export type TrackingContextValueTrackingProps = {
  /**
   * Optional. Whether to track the 'value' attribute. Default to false.
   * When enabled, an InputValueContext will be pushed into the Global Contexts of the InputChangeEvent.
   */
  trackValue?: boolean;

  /**
   * Optional. Whether to trigger events only when values actually changed. Default to false.
   * For example, this allows tracking tabbing (e.g. onBlur and value did not change), which is normally prevented.
   */
  stateless?: boolean;

  /**
   * Optional. Which event handler to use. Default is 'onBlur'.
   * Valid values: `onBlur`, `onChange` or `onClick`.
   */
  eventHandler?: 'onBlur' | 'onChange' | 'onClick';
};

/**
 * These props are common to all TrackedContexts.
 */
export type CommonProps = {
  id?: unknown;
  title?: unknown;
  children?: ReactNode;
};

/**
 * Base props of all TrackedContexts.
 */
export type TrackedContextProps<T> = T &
  CommonProps & {
    objectiv: TrackedContextComponentProp & TrackedContextIdProps;
  };

/**
 * Base props of all TrackedElements. They don't include ComponentProp, as we hard-code that for these components.
 * We also try to auto-detect the identifier from the native `id` property, if present
 */
export type TrackedElementProps<T> = T & {
  objectiv?: TrackedContextIdProps;
};

/**
 * The props of Contexts supporting Visibility events. Extends TrackedContextProps with then `isVisible` property.
 */
export type TrackedShowableContextProps<T> = T &
  CommonProps & {
    objectiv: TrackedContextComponentProp &
      TrackedContextIdProps & {
        /**
         * Whether to track visibility events automatically when this prop changes state.
         */
        isVisible?: boolean;
      };
  };

/**
 * These props are common to all pressables, e.g. button and anchors.
 */
export type PressableCommonProps = CommonProps & {
  onClick?: MouseEventHandler;
};

/**
 * The props of TrackedPressableContext. Extends TrackedContextProps with extra pressable related properties.
 */
export type TrackedPressableContextProps<T> = T &
  PressableCommonProps & {
    objectiv: TrackedContextComponentProp & TrackedContextIdProps;
  };

/**
 * The props of TrackedLinkContext. Extends TrackedContextProps with LinkContext specific properties.
 */
export type TrackedLinkContextProps<T> = T &
  PressableCommonProps & {
    objectiv: TrackedContextComponentProp &
      TrackedContextIdProps & {
        /**
         * The destination of this link, required by LinkContext
         */
        href?: string;

        /**
         * Whether to block and wait for the Tracker having sent the event. Eg: a button redirecting to a new location.
         */
        waitUntilTracked?: boolean;
      };
    href?: string | undefined;
  };

/**
 * Overrides TrackedContextProps to make the objectiv prop and all of its attributes optional.
 */
export type TrackedElementWithOptionalIdProps<T> = T & {
  objectiv?: TrackedContextIdProps;
};

/**
 * Props used for all Tracked Input Elements
 */
export type TrackedInputProps = ComponentProps<'input'> & {
  objectiv?: TrackedContextIdProps & TrackingContextValueTrackingProps;
};
