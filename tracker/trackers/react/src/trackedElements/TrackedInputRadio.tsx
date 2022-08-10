/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import React from 'react';
import { TrackedInputContext, TrackedInputContextProps } from '../trackedContexts/TrackedInputContext';

/**
 * TrackedInputRadio has the same props of a TrackedInput, except:
 * - `id` is made optional, as we can attempt use the `value` attribute for it.
 * - `type` is set to `radio`.
 * - `eventHandler` is redefined to accept only `onBlur` or `onClick`, since `onChange` doesn't work on radios
 * - The default values of `eventHandler` is set to `onClick`
 */
export type TrackedInputRadioProps = Omit<TrackedInputContextProps, 'id' | 'type' | 'eventHandler'> & {
  /**
   * Optional. Defaults to the `value` attribute.
   */
  id?: string;

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
      id={props.id ?? (props.value ? props.value.toString() : '')}
      Component={'input'}
      type={'radio'}
      eventHandler={props.eventHandler ?? 'onClick'}
      ref={ref}
    />
  )
);
