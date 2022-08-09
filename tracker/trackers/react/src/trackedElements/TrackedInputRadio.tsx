/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import React from 'react';
import { TrackedInputContext, TrackedInputContextProps } from '../trackedContexts/TrackedInputContext';

/**
 * TrackedInputRadio has the same props of a TrackedInput, except:
 * - `type` is set to `radio`.
 * - `stateless` is set to `true`.
 * - `eventHandler` is redefined to accept only `onBlur` or `onClick`, since `onChange` doesn't work on radios
 * - The default values of `eventHandler` is set to `onClick`
 */
export type TrackedInputRadioProps = Omit<TrackedInputContextProps, 'type' | 'stateless' | 'eventHandler'> & {
  /**
   * Optional. Defaults to `onClick`. Valid values: 'onBlur' | 'onClick'.
   */
  eventHandler?: 'onBlur' | 'onClick';
};

/**
 * Generates a TrackedInputContext preconfigured with a <input type="radio"> Element as Component.
 * Sets also TrackedInputContext `stateless` prop to true to track all interactions, regardless of values changing.
 * Finally, sets the `eventHandler` to `onClick` instead of the default `onBlur`, unless differently specified.
 */
export const TrackedInputRadio = React.forwardRef<HTMLInputElement, Omit<TrackedInputRadioProps, 'Component'>>(
  (props, ref) => (
    <TrackedInputContext
      {...props}
      Component={'input'}
      type={'radio'}
      stateless={true}
      eventHandler={props.eventHandler ?? 'onClick'}
      ref={ref}
    />
  )
);
