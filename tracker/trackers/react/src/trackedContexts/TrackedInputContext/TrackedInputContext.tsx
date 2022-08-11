/*
 * Copyright 2022 Objectiv B.V.
 */

import React from 'react';
import { TrackedContextProps } from '../../types';
import { TrackedInputContextCheckbox, TrackedInputContextCheckboxProps } from './TrackedInputContextCheckbox';
import { TrackedInputContextRadio, TrackedInputContextRadioProps } from './TrackedInputContextRadio';
import {
  TrackedInputContextSelectMultiple,
  TrackedInputContextSelectMultipleProps,
} from './TrackedInputContextSelectMultiple';
import {
  TrackedInputContextSelectSingle,
  TrackedInputContextSelectSingleProps,
} from './TrackedInputContextSelectSingle';
import { TrackedValueBasedInputContext, TrackedValueBasedInputContextProps } from './TrackedValueBasedInputContext';

/**
 * TrackedInputContext has a few additional properties to configure it.
 */
export type TrackedInputContextProps = TrackedContextProps & {
  /**
   * Optional. Whether to track the 'value' attribute. Default to false.
   * When enabled, an InputValueContext will be generated and pushed into the Global Contexts of the InputChangeEvent.
   */
  trackValue?: boolean;

  /**
   * Optional. Whether to trigger events only when values actually changed. Default to false.
   * For example, this allows tracking tabbing (e.g. onBlur and value did not change), which is normally prevented.
   */
  stateless?: boolean;

  /**
   * Optional. Which event handler to use. Default is 'onBlur'.
   * Valid values: `onBlur`, `onChange` or `onClick`.
   */
  eventHandler?: 'onBlur' | 'onChange' | 'onClick';
};

/**
 * Generates a new React Element already wrapped in an InputContext.
 *
 * This Component is a factory to pick the correct TrackedInputContext implementation based on the given props.
 *
 * If no custom implementation is found for the given Component/type combination, the TrackedValueBasedInputContext
 * is used.
 */
export const TrackedInputContext = React.forwardRef((props: TrackedInputContextProps, ref) => {
  if (props.Component === 'select' && !props.multiple) {
    return (
      <TrackedInputContextSelectSingle
        {...(props as TrackedInputContextSelectSingleProps)}
        ref={ref as React.Ref<HTMLSelectElement>}
      />
    );
  }

  if (props.Component === 'select' && props.multiple) {
    return (
      <TrackedInputContextSelectMultiple
        {...(props as TrackedInputContextSelectMultipleProps)}
        ref={ref as React.Ref<HTMLSelectElement>}
      />
    );
  }

  if (props.Component === 'input' && props.type === 'radio') {
    return (
      <TrackedInputContextRadio
        {...(props as TrackedInputContextRadioProps)}
        ref={ref as React.Ref<HTMLInputElement>}
      />
    );
  }

  if (props.Component === 'input' && props.type === 'checkbox') {
    return (
      <TrackedInputContextCheckbox
        {...(props as TrackedInputContextCheckboxProps)}
        ref={ref as React.Ref<HTMLInputElement>}
      />
    );
  }

  return (
    <TrackedValueBasedInputContext
      {...(props as TrackedValueBasedInputContextProps)}
      ref={ref as React.Ref<HTMLInputElement>}
    />
  );
});
