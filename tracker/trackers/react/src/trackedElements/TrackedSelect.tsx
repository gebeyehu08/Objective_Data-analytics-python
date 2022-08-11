/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import React from 'react';
import { TrackedInputContext, TrackedInputContextProps } from '../trackedContexts/TrackedInputContext';

/**
 * Generates a TrackedInputContext preconfigured with a <select> Element as Component.
 */
export const TrackedSelect = React.forwardRef<HTMLSelectElement, Omit<TrackedInputContextProps, 'Component'>>(
  (props, ref) => (
    <TrackedInputContext {...props} Component={'select'} ref={ref} />
  )
);
