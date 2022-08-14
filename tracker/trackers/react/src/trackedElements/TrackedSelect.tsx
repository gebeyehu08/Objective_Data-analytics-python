/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { TrackedContextIdProps, TrackingContextValueTrackingProps } from '@objectiv/tracker-react';
import React, { ComponentProps } from 'react';
import { TrackedInputContext, TrackedInputContextProps } from '../trackedContexts/TrackedInputContext';

/**
 * Props used for TrackedSelect
 */
export type TrackedSelectProps = ComponentProps<'select'> & {
  objectiv?: TrackedContextIdProps & TrackingContextValueTrackingProps;
};

/**
 * Generates a TrackedInputContext preconfigured with a <select> Element as Component.
 */
export const TrackedSelect = React.forwardRef<HTMLSelectElement, Omit<TrackedInputContextProps, 'Component'>>(
  (props, ref) => <TrackedInputContext {...props} Component={'select'} ref={ref} />
);
