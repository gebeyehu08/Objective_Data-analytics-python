/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { AbstractLocationContext, LocationContextName } from '@objectiv/schema';
import { AnyLocationContext } from '../../definitions/LocationContext';

/**
 * A type guard to determine if the given object is a LocationContext.
 */
export const isLocationContext = (locationContext: AbstractLocationContext): locationContext is AnyLocationContext => {
  if (typeof locationContext !== 'object' || locationContext === null) {
    return false;
  }

  if (!locationContext._type) {
    return false;
  }

  if (!locationContext.id) {
    return false;
  }

  return Object.keys(LocationContextName).includes(locationContext._type);
};
