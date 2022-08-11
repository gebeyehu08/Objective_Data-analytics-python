/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { GlobalContexts, makeIdFromString, makeInputValueContext, } from '@objectiv/tracker-core';
import {
  EventTrackerParameters,
  InputContextWrapper,
  TrackingContext,
  trackInputChangeEvent,
  useLocationStack,
} from '@objectiv/tracker-react-core';
import React, { ChangeEvent, FocusEvent, useState } from 'react';
import { isBlurEvent, isChangeEvent, isClickEvent, normalizeValue } from '.';
import { TrackedContextProps } from '../../types';

/**
 * Default TrackedInputContext implementation.
 * This implementation is a catch-all that should work fine for most `value` based inputs. If not, we can extend the
 * factory with more custom implementations handling specific inputs with ad-hoc logic.
 *
 * Monitors the `value` attribute and automatically tracks `InputChangeEvent` when the given Component receives an
 * `onBlur` and `value` changed. We use `onBlur` because we want to avoid triggering an event for each keystroke.
 *
 * Optionally tracks the input's `value` attribute as InputValueContext.
 */
export type TrackedValueBasedInputContextProps = TrackedContextProps<HTMLInputElement> & {
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
   * Valid values: `onBlur`, `onChange` or `onClick'.
   */
  eventHandler?: 'onBlur' | 'onChange' | 'onClick';
};

/**
 * Event definition for TrackedValueBasedInputContext
 */
export type TrackedValueBasedInputContextEvent<T = HTMLInputElement> = FocusEvent<T> | ChangeEvent<T> | React.MouseEvent<T>;

/**
 * TrackedValueBasedInputContext implementation
 */
export const TrackedValueBasedInputContext = React.forwardRef<HTMLInputElement, TrackedValueBasedInputContextProps>(
  (props, ref) => {
    const {
      id,
      Component,
      forwardId = false,
      normalizeId = true,
      trackValue = false,
      stateless = false,
      eventHandler = 'onBlur',
      ...nativeProps
    } = props;

    const initialValue = props.value ?? props.defaultValue;
    const [previousValue, setPreviousValue] = useState<string>(normalizeValue(initialValue));
    const locationStack = useLocationStack();

    let inputId: string | null = id;
    if (normalizeId) {
      inputId = makeIdFromString(inputId);
    }

    const handleEvent = async (event: TrackedValueBasedInputContextEvent, trackingContext: TrackingContext) => {
      if (!inputId) {
        return;
      }

      const eventTarget = event.target as HTMLInputElement;
      const valueToMonitor = normalizeValue(eventTarget.value);

      if (stateless || previousValue !== valueToMonitor) {
        setPreviousValue(valueToMonitor);

        const eventTrackerParameters: EventTrackerParameters & { globalContexts: GlobalContexts } = {
          ...trackingContext,
          globalContexts: [],
        };

        // Add InputValueContext if trackValue has been set
        if (trackValue) {
          eventTrackerParameters.globalContexts.push(
            makeInputValueContext({
              id: inputId,
              value: normalizeValue(eventTarget.value),
            })
          );
        }

        trackInputChangeEvent(eventTrackerParameters);
      }

      if (isBlurEvent(event)) {
        props.onBlur && props.onBlur(event);
      }

      if (isChangeEvent(event)) {
        props.onChange && props.onChange(event);
      }

      if (isClickEvent(event)) {
        props.onClick && props.onClick(event);
      }
    };

    const componentProps = {
      ...nativeProps,
      ...(ref ? { ref } : {}),
      ...(forwardId ? { id } : {}),
    };

    if (!inputId) {
      if (globalThis.objectiv.devTools) {
        const locationPath = globalThis.objectiv.devTools.getLocationPath(locationStack);
        globalThis.objectiv.devTools.TrackerConsole.error(
          `｢objectiv｣ Could not generate a valid id for InputContext:${props.type} @ ${locationPath}. Please provide the \`id\` property.`
        );
      }
      return React.createElement(Component, componentProps);
    }

    return (
      <InputContextWrapper id={inputId}>
        {(trackingContext) =>
          React.createElement(Component, {
            ...componentProps,
            [eventHandler]: (event: TrackedValueBasedInputContextEvent) => handleEvent(event, trackingContext),
          })
        }
      </InputContextWrapper>
    );
  }
);
