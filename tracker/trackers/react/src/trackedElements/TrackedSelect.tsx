/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { TrackedContextIdProps, TrackingContextValueTrackingProps } from '@objectiv/tracker-react';
import React, { ComponentProps, forwardRef, Ref } from 'react';
import { TrackedInputContext } from '../trackedContexts/TrackedInputContext';

/**
 * Props used for TrackedSelect
 */
export type TrackedSelectProps = ComponentProps<'select'> & {
  objectiv?: TrackedContextIdProps & TrackingContextValueTrackingProps;
};

/**
 * Generates a TrackedInputContext preconfigured with a <select> Element as Component.
 */
export const TrackedSelect = forwardRef(
  ({ objectiv, ...nativeProps }: TrackedSelectProps, ref: Ref<HTMLSelectElement>) => (
    <TrackedInputContext objectiv={{ ...objectiv, Component: 'select' }} {...nativeProps} ref={ref} />
  )
);
