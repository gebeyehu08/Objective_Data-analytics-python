/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import React from 'react';
import { TrackedInputContext, TrackedInputContextProps } from '../trackedContexts/TrackedInputContext';

/**
 * Generates a TrackedInputContext preconfigured with a <input> Element as Component.
 */
export const TrackedInput = React.forwardRef<HTMLInputElement, Omit<TrackedInputContextProps, 'Component'>>(
  (props, ref) => {
    // Suggest to use TrackedInputCheckbox when type is 'checkbox'
    if (globalThis.objectiv.devTools) {
      if (props.type === 'checkbox') {
        globalThis.objectiv.devTools.TrackerConsole.warn(
          `｢objectiv｣ We recommend using TrackedInputCheckbox for tracking checkbox inputs.`
        );
      }
      if (props.type === 'radio') {
        globalThis.objectiv.devTools.TrackerConsole.warn(
          `｢objectiv｣ We recommend using TrackedInputRadio for tracking radio inputs.`
        );
      }
    }

    return <TrackedInputContext {...props} Component={'input'} ref={ref} />;
  }
);
