/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { makeIdFromString } from '@objectiv/tracker-core';
import { TrackedContextProps } from '@objectiv/tracker-react';
import { ContentContextWrapper, useLocationStack } from '@objectiv/tracker-react-core';
import React, { ComponentProps, createRef } from 'react';

/**
 * Generates a new React Element already wrapped in a ContentContext.
 */
export const TrackedContentContext = <P, R = undefined>(props: TrackedContextProps<P, R>) => {
  const {
    objectiv: { Component, componentRef, id, normalizeId = true },
    ...nativeProps
  } = props;
  const locationStack = useLocationStack();

  let contentId: string | null = id;
  if (normalizeId) {
    contentId = makeIdFromString(contentId);
  }

  const componentProps = {
    ...nativeProps,
    ...(componentRef ? { ref: componentRef } : {}),
  };

  if (!contentId) {
    if (globalThis.objectiv.devTools) {
      const locationPath = globalThis.objectiv.devTools.getLocationPath(locationStack);
      globalThis.objectiv.devTools.TrackerConsole.error(
        `｢objectiv｣ Could not generate a valid id for ContentContext @ ${locationPath}. Please provide the \`id\` property.`
      );
    }
    return <Component {...componentProps} />;
  }

  return (
    <ContentContextWrapper id={contentId}>
      <Component {...componentProps} />
    </ContentContextWrapper>
  );
};

type TestComponentProps = {
  abc: string;
};

const TestComponent = (props: TestComponentProps) => <div>{props.abc}</div>;

export const TestWrapper = () => {
  const inputRef = createRef<HTMLInputElement>();

  return (
    <>
      {/* Render our custom component normally */}
      <TestComponent abc={'test'} />

      {/* An input component, because we can provide its props type we get autocomplete and TS validation */}
      <TrackedContentContext<ComponentProps<'input'>> objectiv={{ Component: 'input', id: 'test' }} />

      {/* Custom component wrapped in TrackedContentContext, this will enrich TestComponent with our tracking logic */}
      <TrackedContentContext<TestComponentProps, HTMLInputElement>
        abc={'asd'}
        objectiv={{
          id: 'test',
          Component: TestComponent,
          componentRef: inputRef,
        }}
      />
    </>
  );
};
