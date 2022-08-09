/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import React from 'react';
import { TrackedInputContext, TrackedInputContextProps } from '../trackedContexts/TrackedInputContext';

/**
 * TrackedRadio has the same props of a TrackedInput, except the `type` and `stateless` attributes.
 * Those are hard-coded respectively to `radio` and `true`.
 */
export type TrackedRadioProps = Omit<TrackedInputContextProps, 'type' | 'stateless'>;

/**
 * Generates a TrackedInputContext preconfigured with a <input type="radio"> Element as Component.
 * It
 */
export const TrackedRadio = React.forwardRef<HTMLInputElement, Omit<TrackedRadioProps, 'Component'>>((props, ref) => (
  <TrackedInputContext {...props} Component={'input'} type={'radio'} stateless={true} ref={ref} />
));
