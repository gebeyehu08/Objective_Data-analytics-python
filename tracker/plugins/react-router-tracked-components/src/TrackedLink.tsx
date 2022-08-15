/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import {
  NativeLinkCommonProps,
  ObjectivIdProps,
  ObjectivLinkContextProps,
  TrackedLinkContext,
} from '@objectiv/tracker-react';
import React, { ComponentProps, forwardRef, Ref } from 'react';
import { Link, LinkProps, useHref } from 'react-router-dom';

/**
 * An overridden version of TrackedLinkProps:
 * - The objectiv props, and the object itself, are entirely optional
 * - No Component prop, as it's hard-coded to Link
 */
export type TrackedLinkProps = LinkProps &
  NativeLinkCommonProps & {
    objectiv?: ObjectivIdProps & ObjectivLinkContextProps;
  };

/**
 * Wraps Link in a TrackedLinkContext which automatically instruments tracking PressEvent on click.
 */
export const TrackedLink = forwardRef(({ objectiv, ...nativeProps }: TrackedLinkProps, ref: Ref<HTMLAnchorElement>) => {
  // Use ReactRouter hooks to generate the `href` prop.
  const linkContextHref = useHref(nativeProps.to);

  return (
    <TrackedLinkContext<ComponentProps<typeof Link>>
      {...nativeProps}
      ref={ref}
      objectiv={{
        Component: Link,
        id: objectiv?.id,
        href: linkContextHref,
        waitUntilTracked: objectiv?.waitUntilTracked ?? nativeProps.reloadDocument,
      }}
    />
  );
});
