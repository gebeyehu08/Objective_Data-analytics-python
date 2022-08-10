/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import {
  GlobalContexts,
  LocationStack,
  makeContentContext,
  makeIdFromString,
  makeInputValueContext
} from '@objectiv/tracker-core';
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
   * Optional. Whether to track the input 'value' (or 'checked' for checkboxes and radios). Default to false.
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

  /**
   * Optional. Which attribute to monitor for changes. This has effect only when `stateless` is set to `false`.
   * Supported attributes: 'checked' and 'value'.
   * Default varies depending on input type:
   *  - `radio` and `checkbox`: 'checked' attribute
   *  - all other inputs: 'value' attribute
   */
  attributeToMonitor?: 'checked' | 'value';

  /**
   * Optional. Which attribute to use for InputValueContext. This has effect only when `trackValue` is set to `true`.
   * Supported attributes: 'checked' and 'value'.
   * Default varies depending on input type:
   *  - `radio` and `checkbox`: 'checked' attribute
   *  - all other inputs: 'value' attribute
   */
  attributeToTrack?: 'checked' | 'value';
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
 * Helper function to parse the value of the monitored attribute.
 * Ensures the result is a string and normalizes booleans to '0' and '1'
 */
export const normalizeValue = (value?: unknown) => {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  return '';
};

/**
 * Generates a new React Element already wrapped in an InputContext.
 * Automatically tracks InputChangeEvent when the given Component receives an `onBlur` SyntheticEvent.
 */
export const TrackedInputContext = React.forwardRef<HTMLInputElement, TrackedInputContextProps>((props, ref) => {
  // Checkboxes and radios will monitor a different attribute (checked) than other inputs (value)
  const inputType = props.type ?? 'text';
  const isCheckboxOrRadio = ['radio', 'checkbox'].includes(inputType);
  const isRadio = inputType === 'radio';

  // Parse props and apply some defaults
  const {
    id,
    Component,
    forwardId = false,
    normalizeId = true,
    trackValue = false,
    stateless = false,
    eventHandler = 'onBlur',
    attributeToMonitor = isCheckboxOrRadio ? 'checked' : 'value',
    attributeToTrack = isCheckboxOrRadio ? 'checked' : 'value',
    ...otherProps
  } = props;

  // Basic input validation to inform developers of useless options combinations
  if (globalThis.objectiv.devTools) {
    if (stateless && attributeToMonitor) {
      globalThis.objectiv.devTools.TrackerConsole.error(
        `｢objectiv｣ attributeToMonitor (${attributeToMonitor}) has no effect with stateless set to true.`
      );
    }
    if (attributeToMonitor !== 'checked' && isCheckboxOrRadio) {
      globalThis.objectiv.devTools.TrackerConsole.error(
        `｢objectiv｣ attributeToMonitor (${attributeToMonitor}) should be set to 'checked' for ${inputType} inputs.`
      );
    }
  }

  const initialValue = props[attributeToMonitor] ?? (isCheckboxOrRadio ? props.defaultChecked : props.defaultValue);
  const [previousValue, setPreviousValue] = useState<string>(normalizeValue(initialValue));
  const locationStack = useLocationStack();

  let inputId: string | null = id;
  if (normalizeId) {
    inputId = makeIdFromString(inputId);
  }

  const handleEvent = async (
    event: FocusEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
    trackingContext: TrackingContext
  ) => {
    const valueToMonitor = normalizeValue(event.target[attributeToMonitor]);

    if (stateless || previousValue !== valueToMonitor) {
      setPreviousValue(valueToMonitor);

      const eventTrackerParameters: EventTrackerParameters & { globalContexts: GlobalContexts, locationStack: LocationStack } = {
        ...trackingContext,
        globalContexts: []
      };

      // Add LocationContext representing the group, if `name` has been set on radio buttons
      if(isRadio && event.target.name) {
        const nameContentContextId = makeIdFromString(event.target.name);
        if (nameContentContextId) {
          eventTrackerParameters.locationStack.push(makeContentContext({
            id: nameContentContextId
          }))
        }
      }

      // Add InputValueContext if trackValue has been set
      if (inputId && trackValue) {
        eventTrackerParameters.globalContexts.push(
          makeInputValueContext({
            id: inputId,
            value: normalizeValue(event.target[attributeToTrack]),
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
    ...otherProps,
    ...(ref ? { ref } : {}),
    ...(forwardId ? { id } : {}),
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
