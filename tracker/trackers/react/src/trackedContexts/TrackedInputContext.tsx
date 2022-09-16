/*
 * Copyright 2022 Objectiv B.V.
 */

import { GlobalContexts, makeId, makeInputValueContext } from '@objectiv/tracker-core';
import {
  EventTrackerParameters,
  InputContextWrapper,
  TrackingContext,
  trackInputChangeEvent,
  useLocationStack,
} from '@objectiv/tracker-react-core';
import React, { forwardRef, PropsWithRef, Ref, useState } from 'react';
import { NativeInputCommonProps, TrackedInputContextEvent, TrackedInputContextProps } from '../types';
import { isBlurEvent, isChangeEvent, isClickEvent, normalizeValue } from './TrackedInputContextShared';

/**
 * Generates a new React Element already wrapped in an InputContext.
 */
export const TrackedInputContext = forwardRef(
  <T extends unknown>(props: TrackedInputContextProps<T>, ref: Ref<unknown>) => {
    const {
      objectiv: { Component, id, normalizeId = true, trackValue = false, stateless = false },
      ...nativeProps
    } = props;

    const locationStack = useLocationStack();

    let eventHandler: 'onBlur' | 'onChange' | 'onClick';
    let initialValue: string | number | boolean | string[] | readonly string[] | undefined;
    let inputId: string | null | undefined;
    let attributeToMonitor: string;

    if(Component == 'select') {
      inputId = id ?? nativeProps.id;
      eventHandler = props.objectiv.eventHandler ?? 'onChange';
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
          initialValue = nativeProps.checked ?? nativeProps.defaultChecked;
          attributeToMonitor = 'checked';
          break;
        default:
          inputId = id ?? nativeProps.id;
          eventHandler = props.objectiv.eventHandler ?? 'onBlur';
          initialValue = nativeProps.value ?? nativeProps.defaultValue;
          attributeToMonitor = 'value';
      }
    }

    const [previousValue, setPreviousValue] = useState<string>(normalizeValue(initialValue));

    if (inputId && normalizeId) {
      inputId = makeId(inputId);
    }

    const handleEvent = async(event: TrackedInputContextEvent, trackingContext: TrackingContext) => {
      const eventTarget = event.target as any;
      const valueToMonitor = normalizeValue(eventTarget[attributeToMonitor]);

      if (stateless || previousValue !== valueToMonitor) {
        setPreviousValue(valueToMonitor);

        const eventTrackerParameters: EventTrackerParameters & {
          globalContexts: GlobalContexts;
        } = {
          ...trackingContext,
          globalContexts: [],
        };

        // Add InputValueContext(s) if trackValue has been set
        if (inputId && trackValue) {
          eventTrackerParameters.globalContexts.push(
            makeInputValueContext({
              id: inputId as string,
              value: valueToMonitor,
            })
          );
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
        if(typeof Component === 'string') {
          componentType = Component;
          if(props.type) {
            componentType = props.type;
          }
        }
        if(componentType) {
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
              [eventHandler]: (event: TrackedInputContextEvent) =>
                handleEvent(event, trackingContext),
            }}
          />
        )}
      </InputContextWrapper>
    );
  }
) as <T>(props: PropsWithRef<TrackedInputContextProps<T, NativeInputCommonProps>>) => JSX.Element;

/**
 * Helper function to convert a HTMLOptionsCollection to string[]
 */
const getSelectOptionValues = (options: HTMLCollectionOf<HTMLOptionElement>) => {
  var selectedOptionValues = [];

  for (let i = 0; i < options.length; i++) {
    selectedOptionValues.push(options[i].value);
  }

  return selectedOptionValues;
};
