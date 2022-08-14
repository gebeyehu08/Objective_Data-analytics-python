/*
 * Copyright 2022 Objectiv B.V.
 */

import { TrackedContextComponentProp, TrackedContextIdProps } from '@objectiv/tracker-react';
import React, { ComponentProps, PropsWithRef, Ref } from 'react';
import { TrackedInputContextCheckbox } from './TrackedInputContextCheckbox';
import { TrackedInputContextRadio } from './TrackedInputContextRadio';
import { TrackedInputContextSelectMultiple } from './TrackedInputContextSelectMultiple';
import { TrackedInputContextSelectSingle } from './TrackedInputContextSelectSingle';
import { TrackedValueBasedInputContext } from './TrackedValueBasedInputContext';

/**
 * TrackedInputContext has a few additional properties to configure it.
 */
export type TrackedInputContextProps = (ComponentProps<'input'> | ComponentProps<'select'>) & {
  /**
   * Type prop needs to be redefined becuse it doesn't overlap between input and select
   */
  type?: string;

  /**
   * The Objectiv configuration object
   */
  objectiv: TrackedContextComponentProp &
    TrackedContextIdProps & {
      /**
       * Optional. Whether to track the 'value' attribute. Default to false.
       * When enabled, an InputValueContext will be pushed into the Global Contexts of the InputChangeEvent.
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
};

/**
 * Generates a new React Element already wrapped in an InputContext.
 *
 * This Component is a factory to pick the correct TrackedInputContext implementation based on the given props.
 *
 * If no custom implementation is found for the given Component/type combination, the TrackedValueBasedInputContext
 * is used.
 */
export const TrackedInputContext = React.forwardRef(
  (props: TrackedInputContextProps, ref: Ref<HTMLInputElement | HTMLSelectElement>) => {
    if (props.objectiv.Component === 'select' && !props.multiple) {
      return <TrackedInputContextSelectSingle {...props} ref={ref} />;
    }

    if (props.objectiv.Component === 'select' && props.multiple) {
      return <TrackedInputContextSelectMultiple {...props} ref={ref} />;
    }

    if (props.objectiv.Component === 'input' && props.type === 'radio') {
      return <TrackedInputContextRadio {...props} ref={ref} />;
    }

    if (props.objectiv.Component === 'input' && props.type === 'checkbox') {
      return <TrackedInputContextCheckbox {...props} ref={ref} />;
    }

    return <TrackedValueBasedInputContext {...props} ref={ref} />;
  }
) as (props: PropsWithRef<TrackedInputContextProps>) => JSX.Element;
