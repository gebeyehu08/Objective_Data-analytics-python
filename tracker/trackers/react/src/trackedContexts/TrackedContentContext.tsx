/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { makeIdFromString } from '@objectiv/tracker-core';
import { ContentContextWrapper, useLocationStack } from '@objectiv/tracker-react-core';
import React, { ComponentProps, createRef, ElementType, ReactHTML } from 'react';

type TrackedContextProps<P> = P & {
  Component: ElementType | keyof ReactHTML;
  objectiv: {
    id: string;
    normalizeId?: boolean;
    forwardId?: boolean;
  }
};

type TestComponentProps = {
  abc: string;
};

const TestComponent = (props: TestComponentProps) => <div>{props.abc}</div>;

export const TestWrapper = () => {
  const inputRef = createRef<HTMLInputElement>();
  const selectRef = createRef<HTMLSelectElement>();

  return (
    <>
      <TestComponent abc={'test'} />
      <TrackedContentContext<ComponentProps<'button'>> Component={'input'} objectiv={{ id: 'test' }} />
      <TrackedContentContext<TestComponentProps, HTMLInputElement>
        Component={TestComponent}
        abc={'asd'}
        objectiv={{ id: 'test' }}
        ref={inputRef}
      />
      <TrackedContentContext<TestComponentProps, HTMLSelectElement>
        Component={TestComponent}
        abc={'asd'}
        objectiv={{ id: 'test' }}
        ref={selectRef}
      />
      <TrackedContentContext id={'test'} Component={TestComponent} abc={123} objectiv={{ id: 'test' }} />
    </>
  );
};

// Redeclare forwardRef as the original declaration is a mess with generics
declare module 'react' {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

/**
 * Generates a new React Element already wrapped in a ContentContext.
 */
function TrackedContentContextImplementation<P, R = {}>(props: TrackedContextProps<P>, ref: React.ForwardedRef<R>) {
  const { Component, objectiv: { id, forwardId = false, normalizeId = true }, ...otherProps } = props;
  const locationStack = useLocationStack();

  let contentId: string | null = id;
  if (normalizeId) {
    contentId = makeIdFromString(contentId);
  }

  const componentProps = {
    ...otherProps,
    ...(ref ? { ref } : {}),
    ...(forwardId ? { id } : {}),
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
}

export const TrackedContentContext = React.forwardRef(TrackedContentContextImplementation);
