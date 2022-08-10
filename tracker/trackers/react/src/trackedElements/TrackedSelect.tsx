/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import React from 'react';
import { TrackedInputContext, TrackedInputContextProps } from '../trackedContexts/TrackedInputContext';

/**
 * TrackedSelect has the same props of a TrackedInput, except:
 * - The default value for `Component` is set to `select`.
 * - The default value of `eventHandler` is set to `onChange`
 */
export type TrackedSelectProps = Omit<TrackedInputContextProps, 'Component'> & {
  /**
   * Optional. Defaults to the `value` attribute.
   */
  id?: string;
};

/**
 * Generates a TrackedInputContext preconfigured with a <select> Element as Component.
 */
export const TrackedSelect = React.forwardRef<HTMLInputElement, Omit<TrackedSelectProps, 'Component'>>((props, ref) => (
  <TrackedInputContext {...props} Component={'select'} eventHandler={props.eventHandler ?? 'onChange'} ref={ref} />
));
