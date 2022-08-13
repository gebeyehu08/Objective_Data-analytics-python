/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { makeIdFromString } from '@objectiv/tracker-core';
import { TrackedContextProps } from '@objectiv/tracker-react';
import { ContentContextWrapper, useLocationStack } from '@objectiv/tracker-react-core';
import React, { ComponentProps, createRef, forwardRef, PropsWithRef, Ref } from 'react';

/**
 * Generates a new React Element already wrapped in a ContentContext.
 */
export const TrackedContentContext = forwardRef(<T extends unknown>(props: TrackedContextProps<T>, ref: unknown) => {
  const {
    objectiv: { Component, id, normalizeId = true },
    ...nativeProps
  } = props;
  const locationStack = useLocationStack();

  let contentId: string | null = id;
  if (normalizeId) {
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
}) as <T>(props: PropsWithRef<TrackedContextProps<T>>) => JSX.Element;

type TestComponentProps = {
  abc: string;
};

const TestComponent = forwardRef((props: TestComponentProps, ref: Ref<HTMLDivElement>) => (
  <div ref={ref}>{props.abc}</div>
));

export const TestWrapper = () => {
  const inputRef = createRef<HTMLInputElement>();
  //const selectRef = createRef<HTMLSelectElement>();
  const divRef = createRef<HTMLDivElement>();

  return (
    <>
      {/* Render our custom component normally. */}
      <TestComponent abc={'test'} />

      {/* It's possible to omit the generic props of TrackedContentContext. Not really recommended, though. */}
      <TrackedContentContext ref={inputRef} objectiv={{ Component: 'input', id: 'test' }} />

      {/* An input component gets enriched with our objectiv prop. We get autocomplete for an input in this case. */}
      <TrackedContentContext<ComponentProps<'input'>> ref={inputRef} objectiv={{ Component: 'input', id: 'test' }} />

      {/* A custom component gets enriched as well, and we get TS validation for both prop sets */}
      <TrackedContentContext<ComponentProps<typeof TestComponent>>
        abc={'asd'}
        ref={divRef}
        objectiv={{
          id: 'test',
          Component: TestComponent,
        }}
      />
    </>
  );
};
