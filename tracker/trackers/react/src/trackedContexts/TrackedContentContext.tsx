/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { makeIdFromString } from '@objectiv/tracker-core';
import { TrackedContextProps } from '@objectiv/tracker-react';
import { ContentContextWrapper, useLocationStack } from '@objectiv/tracker-react-core';
import React, { ComponentProps, createRef, forwardRef, PropsWithRef, Ref } from 'react';

/**
 * Generates a new React Element already wrapped in a ContentContext.
 * export default TrackedContentContext as <T extends unknown, R extends unknown>(props: Props<T> & { ref: Ref<R> }) => JSX.Element;
 */
export const TrackedContentContext = forwardRef(<P extends unknown>(props: TrackedContextProps<P>, ref: unknown) => {
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
}) as <T extends unknown>(props: PropsWithRef<TrackedContextProps<T>>) => JSX.Element;


type TestComponentProps = {
  abc: string;
};

const TestComponent = forwardRef((props: TestComponentProps, ref: Ref<HTMLDivElement>) => <div ref={ref}>{props.abc}</div>);

export const TestWrapper = () => {
  const inputRef = createRef<HTMLInputElement>();
  //const selectRef = createRef<HTMLSelectElement>();
  const divRef = createRef<HTMLDivElement>();

  return (
    <>
      {/* Render our custom component normally */}
      <TestComponent abc={'test'} />

      {/* An input component, because we can provide its props type we get autocomplete and TS validation */}
      <TrackedContentContext<ComponentProps<'input'>> objectiv={{ Component: 'input', id: 'test' }} ref={inputRef} />

      {/* Custom component wrapped in TrackedContentContext, this will enrich TestComponent with our tracking logic */}
      <TrackedContentContext<ComponentProps<typeof TestComponent>>
        abc={'asd'}
        objectiv={{
          id: 'test',
          Component: TestComponent,
        }}
        ref={divRef}
      />
    </>
  );
};
