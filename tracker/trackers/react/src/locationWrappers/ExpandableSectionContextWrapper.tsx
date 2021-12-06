/*
 * Copyright 2021 Objectiv B.V.
 */

import { makeExpandableSectionContext } from '@objectiv/tracker-core';
import { ExpandableSectionContextWrapperProps } from '../types';
import { LocationContextWrapper } from './LocationContextWrapper';

/**
 * Wraps its children in an ExpandableSectionContext.
 */
export const ExpandableSectionContextWrapper = ({ children, id }: ExpandableSectionContextWrapperProps) => (
  <LocationContextWrapper locationContext={makeExpandableSectionContext({ id })}>
    {(trackingContext) => (typeof children === 'function' ? children(trackingContext) : children)}
  </LocationContextWrapper>
);
