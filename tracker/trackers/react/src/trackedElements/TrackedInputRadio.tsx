/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import React from 'react';
import { TrackedInputContext, TrackedInputContextProps } from '../trackedContexts/TrackedInputContext';

/**
 * TrackedInputRadio has the same props of a TrackedInput, except:
 * - `id` is made optional, as we can attempt use the `value` attribute for it.
 * - The default and only allowed value for `type` is set to `radio`.
 * - `stateless` is set to `true` and cannot be changed.
 * - The default value of `eventHandler` is set to `onChange`
 */
export type TrackedInputRadioProps = Omit<TrackedInputContextProps, 'Component' | 'id'> & {
  /**
   * Optional. Defaults to the `value` attribute.
   */
  id?: string;

  /**
   * Optional. Restricted to only 'radio'.
   */
  type?: 'radio';
};

/**
 * Generates a TrackedInputContext preconfigured with a <input type="radio"> Element as Component.
 */
export const TrackedInputRadio = React.forwardRef<HTMLInputElement, TrackedInputRadioProps>((props, ref) => {
  if (globalThis.objectiv.devTools && props.type && props.type !== 'radio') {
    globalThis.objectiv.devTools.TrackerConsole.warn(
      `｢objectiv｣ TrackedInputRadio type attribute can only be set to 'radio'.`
    );
  }

  return (
    <TrackedInputContext
      {...props}
      id={props.id ?? (props.value ? props.value.toString() : '')}
      Component={'input'}
      type={'radio'}
      ref={ref}
    />
  );
});
