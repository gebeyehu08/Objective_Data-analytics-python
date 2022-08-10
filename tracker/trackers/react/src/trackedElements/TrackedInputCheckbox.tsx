/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import React from 'react';
import { TrackedInputContext, TrackedInputContextProps } from '../trackedContexts/TrackedInputContext';

/**
 * TrackedInputCheckbox has the same props of a TrackedInput, except:
 * - `id` is made optional, as we can attempt use the `value` attribute for it.
 * - `type` is set to `checkbox`.
 * - `eventHandler` is redefined to accept only `onBlur` or `onClick`, since `onChange` doesn't work on checkboxes
 * - The default value of `eventHandler` is set to `onClick`
 */
export type TrackedInputCheckboxProps = Omit<TrackedInputContextProps, 'id' | 'type' | 'eventHandler'> & {
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
 * Generates a TrackedInputContext preconfigured with a <input type="checkbox"> Element as Component.
 */
export const TrackedInputCheckbox = React.forwardRef<HTMLInputElement, Omit<TrackedInputCheckboxProps, 'Component'>>(
  (props, ref) => {
    return (
      <TrackedInputContext
        {...props}
        id={props.id ?? (props.value ? props.value.toString() : '')}
        Component={'input'}
        type={'checkbox'}
        eventHandler={props.eventHandler ?? 'onClick'}
        ref={ref}
      />
    );
  }
);
