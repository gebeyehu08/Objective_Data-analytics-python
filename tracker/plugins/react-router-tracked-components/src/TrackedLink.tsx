/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { ObjectivIdProps, ObjectivLinkContextProps, TrackedLinkContext } from '@objectiv/tracker-react';
import React, { ComponentProps, forwardRef } from 'react';
import { Link, LinkProps, useHref } from 'react-router-dom';

/**
 * An overridden version of TrackedLinkProps:
 * - The objectiv props, and the object itself, are entirely optional
 *   - We also omit the `href` option: we can retrieve one automatically via `useHref`
 * - No Component prop, as it's hard-coded to Link
 */
export type TrackedLinkProps = LinkProps & {
  objectiv?: ObjectivIdProps & Omit<ObjectivLinkContextProps, 'href'>;
};

/**
 * Wraps Link in a TrackedLinkContext which automatically instruments tracking PressEvent on click.
 */
export const TrackedLink = forwardRef<HTMLAnchorElement, TrackedLinkProps>(({ objectiv, ...nativeProps }, ref) => {
  // Use ReactRouter hooks to generate the `href` prop.
  const linkContextHref = useHref(nativeProps.to);

  return (
    <TrackedLinkContext<ComponentProps<typeof Link>>
      {...nativeProps}
      ref={ref}
      objectiv={{
        ...objectiv,
        Component: Link,
        href: linkContextHref,
        waitUntilTracked: objectiv?.waitUntilTracked ?? nativeProps.reloadDocument,
      }}
    />
  );
});
