/*
 * Copyright 2021-2022 Objectiv B.V.
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
import React, { ChangeEvent, FocusEvent, MouseEvent, SyntheticEvent, useState } from 'react';
import { TrackedContextProps } from '../types';

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
type TrackedValueBasedInputContextProps = TrackedContextProps<HTMLInputElement> & {
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

type TrackedValueBasedInputContextEvent<T = HTMLInputElement> = FocusEvent<T> | ChangeEvent<T> | React.MouseEvent<T>;

const TrackedValueBasedInputContext = React.forwardRef<HTMLInputElement, TrackedValueBasedInputContextProps>(
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

/**
 * TrackedInputContext implementation for radio buttons.
 * Stateless by default. Tracks InputChangeEvent when the given Component receives an `onChange` SyntheticEvent.
 * Optionally tracks the input's `checked` as InputValueContext.
 */
type TrackedInputContextRadioProps = TrackedContextProps<HTMLInputElement> & {
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

type TrackedInputContextRadioEvent<T = HTMLInputElement> = FocusEvent<T> | ChangeEvent<T> | React.MouseEvent<T>;

const TrackedInputContextRadio = React.forwardRef<HTMLInputElement, TrackedInputContextRadioProps>((props, ref) => {
  const {
    id,
    Component,
    forwardId = false,
    normalizeId = true,
    trackValue = false,
    stateless = true,
    eventHandler = 'onChange',
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
    if (!inputId) {
      return;
    }

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
      if (trackValue) {
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
    ...(forwardId ? { id } : {}),
  };

  if (!inputId) {
    if (globalThis.objectiv.devTools) {
      const locationPath = globalThis.objectiv.devTools.getLocationPath(locationStack);
      globalThis.objectiv.devTools.TrackerConsole.error(
        `｢objectiv｣ Could not generate a valid id for InputContext:radio @ ${locationPath}. Please provide the \`id\` property.`
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

/**
 * TrackedInputContext implementation for checkboxes.
 * Monitors the `checked` attribute and automatically tracks `InputChangeEvent` when the given Component receives an
 * `onChange` and `checked` changed.
 * Optionally tracks the input's `checked` attribute as InputValueContext.
 */
type TrackedInputContextCheckboxProps = TrackedContextProps<HTMLInputElement> & {
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
   * Valid values: `onBlur`,  `onChange` or `onClick`.
   */
  eventHandler?: 'onBlur' | 'onChange' | 'onClick';
};

type TrackedInputContextCheckboxEvent<T = HTMLInputElement> = FocusEvent<T> | ChangeEvent<T> | React.MouseEvent<T>;

const TrackedInputContextCheckbox = React.forwardRef<HTMLInputElement, TrackedInputContextCheckboxProps>(
  (props, ref) => {
    const {
      id,
      Component,
      forwardId = false,
      normalizeId = true,
      trackValue = false,
      stateless = false,
      eventHandler = 'onChange',
      ...nativeProps
    } = props;

    const initialValue = props.checked ?? props.defaultChecked;
    const [previousValue, setPreviousValue] = useState<string>(normalizeValue(initialValue));
    const locationStack = useLocationStack();

    let inputId: string | null = id;
    if (normalizeId) {
      inputId = makeIdFromString(inputId);
    }

    const handleEvent = async (event: TrackedInputContextCheckboxEvent, trackingContext: TrackingContext) => {
      if (!inputId) {
        return;
      }

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
      ...(forwardId ? { id } : {}),
    };

    if (!inputId) {
      if (globalThis.objectiv.devTools) {
        const locationPath = globalThis.objectiv.devTools.getLocationPath(locationStack);
        globalThis.objectiv.devTools.TrackerConsole.error(
          `｢objectiv｣ Could not generate a valid id for InputContext:checkbox @ ${locationPath}. Please provide the \`id\` property.`
        );
      }
      return React.createElement(Component, componentProps);
    }

    return (
      <InputContextWrapper id={inputId}>
        {(trackingContext) =>
          React.createElement(Component, {
            ...componentProps,
            [eventHandler]: (event: TrackedInputContextCheckboxEvent) => handleEvent(event, trackingContext),
          })
        }
      </InputContextWrapper>
    );
  }
);

/**
 * TrackedInputContext implementation for selects.
 */
type TrackedInputContextSelectSingleProps = TrackedContextProps<HTMLSelectElement> & {
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

type TrackedInputContextSelectSingleEvent<T = HTMLSelectElement> = FocusEvent<T> | ChangeEvent<T> | React.MouseEvent<T>;

const TrackedInputContextSelectSingle = React.forwardRef<HTMLSelectElement, TrackedInputContextSelectSingleProps>(
  (props, ref) => {
    const {
      id,
      Component,
      forwardId = false,
      normalizeId = true,
      trackValue = false,
      stateless = false,
      eventHandler = 'onChange',
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
      if (!selectId) {
        return;
      }

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
        if (trackValue) {
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
      ...(forwardId ? { id } : {}),
    };

    if (!selectId) {
      if (globalThis.objectiv.devTools) {
        const locationPath = globalThis.objectiv.devTools.getLocationPath(locationStack);
        globalThis.objectiv.devTools.TrackerConsole.error(
          `｢objectiv｣ Could not generate a valid id for InputContext:select @ ${locationPath}. Please provide the \`id\` property.`
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
);

/**
 * A type guard to determine whether the given event is a blur event
 */
function isBlurEvent<T = HTMLInputElement | HTMLSelectElement>(event: SyntheticEvent<T>): event is FocusEvent<T> {
  return event.type === 'blur';
}

/**
 * A type guard to determine whether the given event is a change event
 */
function isChangeEvent<T = HTMLInputElement | HTMLSelectElement>(event: SyntheticEvent<T>): event is ChangeEvent<T> {
  return event.type === 'change';
}

/**
 * A type guard to determine whether the given event is a click event
 */
function isClickEvent<T = HTMLInputElement | HTMLSelectElement>(event: SyntheticEvent<T>): event is MouseEvent<T> {
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
