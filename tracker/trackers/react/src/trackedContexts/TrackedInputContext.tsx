/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { makeIdFromString, makeInputValueContext } from '@objectiv/tracker-core';
import {
  EventTrackerParameters,
  InputContextWrapper,
  TrackingContext,
  trackInputChangeEvent,
  useLocationStack,
} from '@objectiv/tracker-react-core';
import React, { ChangeEvent, FocusEvent, SyntheticEvent, useState } from 'react';
import { TrackedContextProps } from '../types';

/**
 * The props of TrackedInputContext. Extends TrackedContextProps with the optional `trackValue` property.
 */
export type TrackedInputContextProps = TrackedContextProps<HTMLInputElement> & {
  /**
   * Optional. Whether to track the input value. Default to false.
   * When enabled, an InputValueContext will be generated and pushed into the Global Contexts of the InputChangeEvent.
   */
  trackValue?: boolean;

  /**
   * Optional. Whether to trigger events only when values actually changed. Default to false.
   * This is mainly useful for radio buttons, where values never change between onBlurs.
   */
  stateless?: boolean;

  /**
   * Optional. Which event handler to use. Default is 'onBlur'. Valid values: 'onBlur' | 'onChange' | 'onClick'.
   */
  eventHandler?: 'onBlur' | 'onChange' | 'onClick';
};

/**
 * A type guard to determine whether the given event is a blur event
 */
const isBlurEvent = (event: SyntheticEvent<HTMLInputElement>): event is FocusEvent<HTMLInputElement> => {
  return event.type === 'blur';
};

/**
 * A type guard to determine whether the given event is a change event
 */
const isChangeEvent = (event: SyntheticEvent<HTMLInputElement>): event is ChangeEvent<HTMLInputElement> => {
  return event.type === 'change';
};

/**
 * A type guard to determine whether the given event is a click event
 */
const isClickEvent = (event: SyntheticEvent<HTMLInputElement>): event is React.MouseEvent<HTMLInputElement> => {
  return event.type === 'click';
};

/**
 * Generates a new React Element already wrapped in an InputContext.
 * Automatically tracks InputChangeEvent when the given Component receives an `onBlur` SyntheticEvent.
 */
export const TrackedInputContext = React.forwardRef<HTMLInputElement, TrackedInputContextProps>((props, ref) => {
  const {
    id,
    Component,
    forwardId = false,
    defaultValue,
    normalizeId = true,
    trackValue = false,
    stateless = false,
    eventHandler = 'onBlur',
    ...otherProps
  } = props;
  const [previousValue, setPreviousValue] = useState<string>(defaultValue ? defaultValue.toString() : '');
  const locationStack = useLocationStack();

  let inputId: string | null = id;
  if (normalizeId) {
    inputId = makeIdFromString(inputId);
  }

  const handleEvent = async (
    event: FocusEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
    trackingContext: TrackingContext
  ) => {
    if (stateless || previousValue !== event.target.value) {
      setPreviousValue(event.target.value);

      let eventTrackerParameters: EventTrackerParameters = trackingContext;

      // Add InputValueContext if trackValue has been set
      if (inputId && trackValue) {
        eventTrackerParameters = {
          ...eventTrackerParameters,
          globalContexts: [makeInputValueContext({ id: inputId, value: event.target.value })],
        };
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
    ...otherProps,
    ...(ref ? { ref } : {}),
    ...(forwardId ? { id } : {}),
    defaultValue,
  };

  if (!inputId) {
    if (globalThis.objectiv.devTools) {
      const locationPath = globalThis.objectiv.devTools.getLocationPath(locationStack);
      globalThis.objectiv.devTools.TrackerConsole.error(
        `｢objectiv｣ Could not generate a valid id for InputContext @ ${locationPath}. Please provide the \`id\` property.`
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
});
