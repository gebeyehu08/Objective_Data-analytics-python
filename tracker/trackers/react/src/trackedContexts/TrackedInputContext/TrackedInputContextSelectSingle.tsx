/*
 * Copyright 2022 Objectiv B.V.
 */

import { GlobalContexts, LocationStack, makeIdFromString, makeInputValueContext } from '@objectiv/tracker-core';
import {
  EventTrackerParameters,
  InputContextWrapper,
  TrackingContext,
  trackInputChangeEvent,
  useLocationStack,
} from '@objectiv/tracker-react-core';
import React, { ChangeEvent, ComponentProps, FocusEvent, forwardRef, PropsWithRef, Ref, useState } from 'react';
import { TrackedContextComponentProp, TrackedContextIdProps, TrackedContextProps } from '../../types';
import { isBlurEvent, isChangeEvent, isClickEvent, normalizeValue } from './TrackedInputContextShared';

/**
 * TrackedInputContext implementation for selects.
 */
export type TrackedInputContextSelectSingleProps = ComponentProps<'select'> & {
  objectiv: TrackedContextComponentProp &
    TrackedContextIdProps & {
      /**
       * Optional. Whether to track the 'value' attribute. Default to false.
       * When enabled, an InputValueContext will be generated and pushed into the Global Contexts of the InputChangeEvent.
       */
      trackValue?: boolean;

      /**
       * Optional. Whether to trigger events only when values actually changed. Default to false.
       * For example, this allows tracking re-selections of the same value, which is normally prevented.
       */
      stateless?: boolean;

      /**
       * Optional. Which event handler to use. Default is 'onChange'.
       * Valid values: `onBlur`, `onChange` or `onClick`.
       */
      eventHandler?: 'onBlur' | 'onChange' | 'onClick';
    };
};

/**
 * Event definition for TrackedInputContextSelectSingle
 */
export type TrackedInputContextSelectSingleEvent =
  | FocusEvent<HTMLSelectElement>
  | ChangeEvent<HTMLSelectElement>
  | React.MouseEvent<HTMLSelectElement>;

/**
 * TrackedInputContextSelectSingle implementation
 */
export const TrackedInputContextSelectSingle = forwardRef(
  (props: TrackedInputContextSelectSingleProps, ref: Ref<HTMLSelectElement>) => {
    const {
      objectiv: { Component, id, normalizeId = true, trackValue = false, stateless = false, eventHandler = 'onChange' },
      ...nativeProps
    } = props;

    const initialValue = props.value ?? props.defaultValue;
    const [previousValue, setPreviousValue] = useState<string>(normalizeValue(initialValue));
    const locationStack = useLocationStack();

    let selectId: string | null = id;
    if (normalizeId) {
      selectId = makeIdFromString(selectId);
    }

    const handleEvent = async (event: TrackedInputContextSelectSingleEvent, trackingContext: TrackingContext) => {
      const eventTarget = event.target as HTMLSelectElement;
      const valueToMonitor = normalizeValue(eventTarget.value);

      if (stateless || previousValue !== valueToMonitor) {
        setPreviousValue(valueToMonitor);

        const eventTrackerParameters: EventTrackerParameters & {
          globalContexts: GlobalContexts;
          locationStack: LocationStack;
        } = {
          ...trackingContext,
          globalContexts: [],
        };

        // Add InputValueContext if trackValue has been set
        if (selectId && trackValue) {
          eventTrackerParameters.globalContexts.push(
            makeInputValueContext({
              id: selectId,
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
    };

    if (!selectId) {
      if (globalThis.objectiv.devTools) {
        const locationPath = globalThis.objectiv.devTools.getLocationPath(locationStack);
        globalThis.objectiv.devTools.TrackerConsole.error(
          `｢objectiv｣ Could not generate a valid id for InputContext:select @ ${locationPath}. Please provide the \`objectiv.id\` property.`
        );
      }
      return React.createElement(Component, componentProps);
    }

    return (
      <InputContextWrapper id={selectId}>
        {(trackingContext) =>
          React.createElement(Component, {
            ...componentProps,
            [eventHandler]: (event: TrackedInputContextSelectSingleEvent) => handleEvent(event, trackingContext),
          })
        }
      </InputContextWrapper>
    );
  }
) as <T>(props: PropsWithRef<TrackedContextProps<T>>) => JSX.Element;
