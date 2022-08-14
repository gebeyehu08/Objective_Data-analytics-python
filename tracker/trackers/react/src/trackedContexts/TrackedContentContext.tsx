/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { makeIdFromString } from '@objectiv/tracker-core';
import { TrackedContextProps } from '@objectiv/tracker-react';
import { ContentContextWrapper, useLocationStack } from '@objectiv/tracker-react-core';
import React, { forwardRef, PropsWithRef, Ref } from 'react';

/**
 * Generates a new React Element already wrapped in a ContentContext.
 */
export const TrackedContentContext = forwardRef(
  <T extends unknown>(props: TrackedContextProps<T>, ref: Ref<unknown>) => {
    const {
      objectiv: { Component, id, normalizeId = true },
      ...nativeProps
    } = props;
    const locationStack = useLocationStack();

    let contentId: string | null | undefined = id ?? nativeProps.id;
    if (contentId && normalizeId) {
      contentId = makeIdFromString(contentId);
    }

    const componentProps = {
      ...nativeProps,
      ...(ref ? { ref } : {}),
    };

    if (!contentId) {
      if (globalThis.objectiv.devTools) {
        const locationPath = globalThis.objectiv.devTools.getLocationPath(locationStack);
        globalThis.objectiv.devTools.TrackerConsole.error(
          `｢objectiv｣ Could not generate a valid id for ContentContext @ ${locationPath}. Please provide the \`objectiv.id\` property.`
        );
      }
      return <Component {...componentProps} />;
    }

    return (
      <ContentContextWrapper id={contentId}>
        <Component {...componentProps} />
      </ContentContextWrapper>
    );
  }
) as <T>(props: PropsWithRef<TrackedContextProps<T>>) => JSX.Element;
