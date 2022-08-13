/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { TrackedElementProps } from '@objectiv/tracker-react';
import React, { ComponentProps } from 'react';
import { TrackedContentContext } from '../trackedContexts/TrackedContentContext';

/**
 * Generates a TrackedContentContext preconfigured with a <div> Element as Component.
 */
export const TrackedDiv = ({ objectiv, ...otherProps }: TrackedElementProps<ComponentProps<'div'>>) => (
  <TrackedContentContext<ComponentProps<'div'>, HTMLDivElement>
    objectiv={{ ...objectiv, Component: 'div' }}
    {...otherProps}
  />
);
