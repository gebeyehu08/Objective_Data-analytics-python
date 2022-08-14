/*
 * Copyright 2022 Objectiv B.V.
 */

import {
  GlobalContexts,
  LocationStack,
  makeContentContext,
  makeIdFromString,
  makeInputValueContext,
} from '@objectiv/tracker-core';
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
 * TrackedInputContext implementation for radio buttons.
 * Stateless by default. Tracks InputChangeEvent when the given Component receives an `onChange` SyntheticEvent.
 * Optionally tracks the input's `checked` as InputValueContext.
 */
export type TrackedInputContextRadioProps = ComponentProps<'input'> & {
  objectiv: TrackedContextComponentProp &
    TrackedContextIdProps & {
      /**
       * Optional. Whether to track the 'value' attribute. Default to false.
       * When enabled, an InputValueContext will be generated and pushed into the Global Contexts of the InputChangeEvent.
       */
      trackValue?: boolean;

      /**
       * Optional. Whether to trigger events only when values actually changed. Default to false.
       * For example, this allows tracking re-selections of the same value (e.g. onBlur), which is normally prevented.
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
 * Event definition for TrackedInputContextRadio
 */
export type TrackedInputContextRadioEvent =
  | FocusEvent<HTMLInputElement>
  | ChangeEvent<HTMLInputElement>
  | React.MouseEvent<HTMLInputElement>;

/**
 * TrackedInputContextRadio implementation
 */
export const TrackedInputContextRadio = forwardRef(
  (props: TrackedInputContextRadioProps, ref: Ref<HTMLInputElement>) => {
    const {
      objectiv: { Component, id, normalizeId = true, trackValue = false, stateless = true, eventHandler = 'onChange' },
      ...nativeProps
    } = props;

    const initialValue = props.checked ?? props.defaultChecked;
    const [previousValue, setPreviousValue] = useState<string>(normalizeValue(initialValue));
    const locationStack = useLocationStack();

    let inputId: string | null = id;
    if (normalizeId) {
      inputId = makeIdFromString(inputId);
    }

    const handleEvent = async (event: TrackedInputContextRadioEvent, trackingContext: TrackingContext) => {
      const eventTarget = event.target as HTMLInputElement;
      const valueToMonitor = normalizeValue(eventTarget.checked);

      if (stateless || previousValue !== valueToMonitor) {
        setPreviousValue(valueToMonitor);

        const eventTrackerParameters: EventTrackerParameters & {
          globalContexts: GlobalContexts;
          locationStack: LocationStack;
        } = {
          ...trackingContext,
          globalContexts: [],
        };

        // Add LocationContext representing the radio group, if the `name` attribute has been set
        if (eventTarget.name) {
          const nameContentContextId = makeIdFromString(eventTarget.name);
          if (nameContentContextId) {
            const locationStackClone = [...eventTrackerParameters.locationStack];
            locationStackClone.splice(
              eventTrackerParameters.locationStack.length - 1,
              0,
              makeContentContext({
                id: nameContentContextId,
              })
            );
            eventTrackerParameters.locationStack = locationStackClone;
          }
        }

        // Add InputValueContext if trackValue has been set
        if (inputId && trackValue) {
          eventTrackerParameters.globalContexts.push(
            makeInputValueContext({
              id: inputId,
              value: normalizeValue(eventTarget.checked),
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

    if (!inputId) {
      if (globalThis.objectiv.devTools) {
        const locationPath = globalThis.objectiv.devTools.getLocationPath(locationStack);
        globalThis.objectiv.devTools.TrackerConsole.error(
          `｢objectiv｣ Could not generate a valid id for InputContext:radio @ ${locationPath}. Please provide the \`objectiv.id\` property.`
        );
      }
      return React.createElement(Component, componentProps);
    }

    return (
      <InputContextWrapper id={inputId}>
        {(trackingContext) =>
          React.createElement(Component, {
            ...componentProps,
            [eventHandler]: (event: FocusEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>) =>
              handleEvent(event, trackingContext),
          })
        }
      </InputContextWrapper>
    );
  }
) as <T>(props: PropsWithRef<TrackedContextProps<T>>) => JSX.Element;
