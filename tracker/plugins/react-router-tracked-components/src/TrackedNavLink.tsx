/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { ObjectivIdProps, ObjectivLinkContextProps, TrackedLinkContext } from '@objectiv/tracker-react';
import React, { ComponentProps, forwardRef } from 'react';
import { NavLink, NavLinkProps, useHref } from 'react-router-dom';

/**
 * An overridden version of TrackedLinkProps:
 * - The objectiv props, and the object itself, are entirely optional
 *   - We also omit the `href` option: we can retrieve one automatically via `useHref`
 * - No Component prop, as it's hard-coded to NavLink
 */
export type TrackedNavLinkProps = NavLinkProps & {
  objectiv?: ObjectivIdProps & Omit<ObjectivLinkContextProps, 'href'>;
};

/**
 * Wraps NavLink in a LinkContext and automatically instruments tracking PressEvent on click.
 */
export const TrackedNavLink = forwardRef<HTMLAnchorElement, TrackedNavLinkProps>(
  ({ objectiv, ...nativeProps }, ref) => {
    // Use ReactRouter hooks to generate the `href` prop.
    const linkContextHref = useHref(nativeProps.to);

    return (
      <TrackedLinkContext<ComponentProps<typeof NavLink>>
        {...nativeProps}
        ref={ref}
        objectiv={{
          ...objectiv,
          Component: NavLink,
          href: linkContextHref,
          waitUntilTracked: objectiv?.waitUntilTracked ?? nativeProps.reloadDocument,
        }}
      />
    );
  }
);
