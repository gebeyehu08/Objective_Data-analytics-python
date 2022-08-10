/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import React from 'react';
import { TrackedInputContext, TrackedInputContextProps } from '../trackedContexts/TrackedInputContext';

/**
 * TrackedInputRadio has the same props of a TrackedInput, except:
 * - `id` is made optional, as we can attempt use the `value` attribute for it.
 * - `type` is set to `radio`.
 * - `stateless` is set to `true`.
 * - The default values of `eventHandler` is set to `onChange`
 */
export type TrackedInputRadioProps = Omit<TrackedInputContextProps, 'id' | 'type' | 'stateless'> & {
  /**
   * Optional. Defaults to the `value` attribute.
   */
  id?: string;
};

/**
 * Generates a TrackedInputContext preconfigured with a <input type="radio"> Element as Component.
 */
export const TrackedInputRadio = React.forwardRef<HTMLInputElement, Omit<TrackedInputRadioProps, 'Component'>>(
  (props, ref) => (
    <TrackedInputContext
      {...props}
      id={props.id ?? (props.value ? props.value.toString() : '')}
      Component={'input'}
      type={'radio'}
      eventHandler={props.eventHandler ?? 'onChange'}
      stateless={true}
      ref={ref}
    />
  )
);
