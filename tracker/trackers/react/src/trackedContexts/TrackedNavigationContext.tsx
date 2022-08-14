/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { makeIdFromString } from '@objectiv/tracker-core';
import { NavigationContextWrapper, useLocationStack } from '@objectiv/tracker-react-core';
import React, { forwardRef, PropsWithRef, Ref } from 'react';
import { TrackedContextProps } from '../types';

/**
 * Generates a new React Element already wrapped in a NavigationContext.
 */
export const TrackedNavigationContext = forwardRef(
  <T extends unknown>(props: TrackedContextProps<T>, ref: Ref<unknown>) => {
    const {
      objectiv: { Component, id, normalizeId = true },
      ...nativeProps
    } = props;

    const locationStack = useLocationStack();

    let navigationId: string | null = id;
    if (normalizeId) {
      navigationId = makeIdFromString(navigationId);
    }

    const componentProps = {
      ...nativeProps,
      ...(ref ? { ref } : {}),
    };

    if (!navigationId) {
      if (globalThis.objectiv.devTools) {
        const locationPath = globalThis.objectiv.devTools.getLocationPath(locationStack);
        globalThis.objectiv.devTools.TrackerConsole.error(
          `｢objectiv｣ Could not generate a valid id for NavigationContext @ ${locationPath}. Please provide the \`id\` property.`
        );
      }
      return <Component {...componentProps} />;
    }

    return (
      <NavigationContextWrapper id={navigationId}>
        <Component {...componentProps} />
      </NavigationContextWrapper>
    );
  }
) as <T>(props: PropsWithRef<TrackedContextProps<T>>) => JSX.Element;
