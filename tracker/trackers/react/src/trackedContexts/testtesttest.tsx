/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import React, { ComponentProps, createRef, forwardRef, Ref } from 'react';
import { TrackedContentContext } from './TrackedContentContext';

// FIXME This is just a playground to test edge cases, delete it when done refactoring
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
