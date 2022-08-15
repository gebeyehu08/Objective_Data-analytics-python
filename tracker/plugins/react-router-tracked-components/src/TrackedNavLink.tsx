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
import { NavLink, NavLinkProps, useHref } from 'react-router-dom';

/**
 * An overridden version of TrackedLinkProps:
 * - The objectiv props, and the object itself, are entirely optional
 * - No Component prop, as it's hard-coded to NavLink
 */
export type TrackedNavLinkProps = NavLinkProps &
  NativeLinkCommonProps & {
    objectiv?: ObjectivIdProps & ObjectivLinkContextProps;
  };

/**
 * Wraps NavLink in a LinkContext and automatically instruments tracking PressEvent on click.
 */
export const TrackedNavLink = forwardRef(
  ({ objectiv, ...nativeProps }: TrackedNavLinkProps, ref: Ref<HTMLAnchorElement>) => {
    // Use ReactRouter hooks to generate the `href` prop.
    const linkContextHref = useHref(nativeProps.to);

    return (
      <TrackedLinkContext<ComponentProps<typeof NavLink>>
        {...nativeProps}
        ref={ref}
        objectiv={{
          Component: NavLink,
          id: objectiv?.id,
          href: linkContextHref,
          waitUntilTracked: objectiv?.waitUntilTracked ?? nativeProps.reloadDocument,
        }}
      />
    );
  }
);
