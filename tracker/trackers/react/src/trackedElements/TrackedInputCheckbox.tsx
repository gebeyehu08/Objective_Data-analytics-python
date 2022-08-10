/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import React from 'react';
import { TrackedInputContext, TrackedInputContextProps } from '../trackedContexts/TrackedInputContext';

/**
 * TrackedInputCheckbox has the same props of a TrackedInput, except:
 * - `id` is made optional, as we can attempt use the `value` attribute for it.
 * - `type` is set to `checkbox`.
 * - The default value of `eventHandler` is set to `onChange`
 */
export type TrackedInputCheckboxProps = Omit<TrackedInputContextProps, 'id' | 'type'> & {
  /**
   * Optional. Defaults to the `value` attribute.
   */
  id?: string;
};

/**
 * Generates a TrackedInputContext preconfigured with a <input type="checkbox"> Element as Component.
 */
export const TrackedInputCheckbox = React.forwardRef<HTMLInputElement, Omit<TrackedInputCheckboxProps, 'Component'>>(
  (props, ref) => (
    <TrackedInputContext
      {...props}
      id={props.id ?? (props.value ? props.value.toString() : '')}
      Component={'input'}
      type={'checkbox'}
      eventHandler={props.eventHandler ?? 'onChange'}
      ref={ref}
    />
  )
);
