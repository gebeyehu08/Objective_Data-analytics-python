/*
 * Copyright 2022 Objectiv B.V.
 */

import { GlobalContexts, makeInputValueContext } from '@objectiv/schema';
import { makeId } from '@objectiv/tracker-core';
import {
  EventTrackerParameters,
  InputContextWrapper,
  TrackingContext,
  trackInputChangeEvent,
  useLocationStack,
} from '@objectiv/tracker-react-core';
import React, {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  MouseEvent,
  PropsWithRef,
  Ref,
  SyntheticEvent,
  useState,
} from 'react';
import { TrackedInputContextEvent, TrackedInputContextProps } from '../types';

/**
 * Generates a new React Element already wrapped in an InputContext.
 */
export const TrackedInputContext = forwardRef(
  <T extends unknown>(props: TrackedInputContextProps<T>, ref: Ref<unknown>) => {
    const {
      objectiv: { Component, id, normalizeId = true, trackValue = false },
      ...nativeProps
    } = props;

    const locationStack = useLocationStack();

    let eventHandler: 'onBlur' | 'onChange' | 'onClick';
    let stateless: boolean;
    let initialValue: string | number | boolean | string[] | readonly string[] | undefined;
    let inputId: string | null | undefined;
    let attributeToMonitor: string;

    if (Component == 'select') {
      inputId = id ?? nativeProps.id;
      eventHandler = props.objectiv.eventHandler ?? 'onChange';
      stateless = props.objectiv.stateless ?? false;
      initialValue = nativeProps.value ?? nativeProps.defaultValue;
      attributeToMonitor = 'value';
    } else {
      switch (props.type) {
        case 'checkbox':
        case 'radio':
          const nameAttribute: string | null = nativeProps.name ? nativeProps.name : null;
          const valueAttribute: string | null = nativeProps.value ? nativeProps.value.toString() : null;
          inputId = id ?? nativeProps.id ?? nameAttribute ?? valueAttribute;
          eventHandler = props.objectiv.eventHandler ?? 'onChange';
          stateless = props.objectiv.stateless ?? props.type === 'radio';
          initialValue = nativeProps.checked ?? nativeProps.defaultChecked;
          attributeToMonitor = 'checked';
          break;
        default:
          inputId = id ?? nativeProps.id;
          eventHandler = props.objectiv.eventHandler ?? 'onBlur';
          stateless = props.objectiv.stateless ?? false;
          initialValue = nativeProps.value ?? nativeProps.defaultValue;
          attributeToMonitor = 'value';
      }
    }

    const [previousValue, setPreviousValue] = useState<string>(normalizeValue(initialValue));

    if (inputId && normalizeId) {
      inputId = makeId(inputId);
    }

    const handleEvent = async (event: TrackedInputContextEvent, trackingContext: TrackingContext) => {
      const eventTarget = event.target as any;
      const value = props.multiple ? getOptionValues(eventTarget.selectedOptions) : eventTarget[attributeToMonitor];
      const normalizedValue = normalizeValue(value);

      if (stateless || previousValue !== normalizedValue) {
        setPreviousValue(normalizedValue);

        const eventTrackerParameters: EventTrackerParameters & {
          globalContexts: GlobalContexts;
        } = {
          ...trackingContext,
          globalContexts: [],
        };

        if (inputId && trackValue) {
          const values = Array.isArray(value) ? value : [value];
          values.map((value) => {
            eventTrackerParameters.globalContexts.push(
              makeInputValueContext({
                id: inputId as string,
                value: normalizeValue(value),
              })
            );
          });
        }

        trackInputChangeEvent(eventTrackerParameters);
      }

      if (isBlurEvent(event)) {
        nativeProps.onBlur && nativeProps.onBlur(event);
      }

      if (isChangeEvent(event)) {
        nativeProps.onChange && nativeProps.onChange(event);
      }

      if (isClickEvent(event)) {
        nativeProps.onClick && nativeProps.onClick(event);
      }
    };

    const componentProps = {
      ...nativeProps,
      ...(ref ? { ref } : {}),
    };

    if (!inputId) {
      if (globalThis.objectiv.devTools) {
        const locationPath = globalThis.objectiv.devTools.getLocationPath(locationStack);
        let componentType: string = '';
        if (typeof Component === 'string') {
          componentType = Component;
          if (props.type) {
            componentType = props.type;
          }
        }
        if (componentType) {
          componentType = `:${componentType}`;
        }
        globalThis.objectiv.devTools.TrackerConsole.error(
          `｢objectiv｣ Could not generate a valid id for InputContext${componentType} @ ${locationPath}. Please provide the \`objectiv.id\` property.`
        );
      }
      return <Component {...componentProps} />;
    }

    return (
      <InputContextWrapper id={inputId}>
        {(trackingContext) => (
          <Component
            {...componentProps}
            {...{
              [eventHandler]: (event: TrackedInputContextEvent) => handleEvent(event, trackingContext),
            }}
          />
        )}
      </InputContextWrapper>
    );
  }
) as <T>(props: PropsWithRef<TrackedInputContextProps<T>>) => JSX.Element;

/**
 * Helper function to convert a HTMLOptionsCollection to string[]
 */
const getOptionValues = (options: HTMLCollectionOf<HTMLOptionElement>) => {
  var selectedOptionValues = [];

  for (let i = 0; i < options.length; i++) {
    selectedOptionValues.push(options[i].value);
  }

  return selectedOptionValues;
};

/**
 * A type guard to determine whether the given event is a blur event
 */
export function isBlurEvent<T = HTMLInputElement | HTMLSelectElement>(
  event: SyntheticEvent<T>
): event is FocusEvent<T> {
  return event.type === 'blur';
}

/**
 * A type guard to determine whether the given event is a change event
 */
export function isChangeEvent<T = HTMLInputElement | HTMLSelectElement>(
  event: SyntheticEvent<T>
): event is ChangeEvent<T> {
  return event.type === 'change';
}

/**
 * A type guard to determine whether the given event is a click event
 */
export function isClickEvent<T = HTMLInputElement | HTMLSelectElement>(
  event: SyntheticEvent<T>
): event is MouseEvent<T> {
  return event.type === 'click';
}

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

  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }

  return '';
};
