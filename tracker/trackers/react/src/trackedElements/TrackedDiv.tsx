/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { TrackedElementProps } from '@objectiv/tracker-react';
import React, { ComponentProps, forwardRef, Ref } from 'react';
import { TrackedContentContext } from '../trackedContexts/TrackedContentContext';

/**
 * Generates a TrackedContentContext preconfigured with a <div> Element as Component.
 */
export const TrackedDiv = forwardRef(
  ({ objectiv, ...otherProps }: TrackedElementProps<ComponentProps<'div'>>, ref: Ref<HTMLDivElement>) => (
    <TrackedContentContext objectiv={{ ...objectiv, Component: 'div' }} {...otherProps} ref={ref} />
  )
);
