/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import React from 'react';
import { TrackedInputContext, TrackedInputContextProps } from '../trackedContexts/TrackedInputContext';

/**
 * TrackedInputCheckbox has the same props of a TrackedInput, except:
 * - `id` is made optional, as we can attempt use the `value` attribute for it.
 * - The default and only allowed value for `type` is set to `checkbox`.
 * - The default value of `eventHandler` is set to `onChange`
 */
export type TrackedInputCheckboxProps = Omit<TrackedInputContextProps, 'Component' | 'id'> & {
  /**
   * Optional. Defaults to the `value` attribute.
   */
  id?: string;

  /**
   * Optional. Restricted to only 'checkbox'.
   */
  type?: 'checkbox';
};

/**
 * Generates a TrackedInputContext preconfigured with a <input type="checkbox"> Element as Component.
 */
export const TrackedInputCheckbox = React.forwardRef<HTMLInputElement, TrackedInputCheckboxProps>((props, ref) => {
  if (globalThis.objectiv.devTools && props.type && props.type !== 'checkbox') {
    globalThis.objectiv.devTools.TrackerConsole.warn(
      `｢objectiv｣ TrackedInputCheckbox type attribute can only be set to 'checkbox'.`
    );
  }

  // Use the given `id` or attempt to automatically generate one with either `name` or `value`
  const nameAttribute: string | null = props.name ? props.name : null;
  const valueAttribute: string | null = props.value ? props.value.toString() : null;
  const id: string = props.id ?? nameAttribute ?? valueAttribute ?? '';

  return <TrackedInputContext {...props} id={id} Component={'input'} type={'checkbox'} ref={ref} />;
});
