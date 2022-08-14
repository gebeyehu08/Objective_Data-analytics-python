/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { makeIdFromString } from '@objectiv/tracker-core';
import { makeTitleFromChildren, TrackedLinkContextProps } from '@objectiv/tracker-react';
import { LinkContextWrapper, useLocationStack } from '@objectiv/tracker-react-core';
import React, { forwardRef, PropsWithRef, Ref } from 'react';
import { makeAnchorClickHandler } from '../common/factories/makeAnchorClickHandler';

/**
 * Generates a new React Element already wrapped in an LinkContext.
 * Automatically tracks PressEvent when the given Component receives an `onClick` SyntheticEvent.
 */
export const TrackedLinkContext = forwardRef(
  <T extends unknown>(props: TrackedLinkContextProps<T>, ref: Ref<unknown>) => {
    const {
      objectiv: { Component, id: trackingId, href: trackingHref, normalizeId = true, waitUntilTracked = false },
      id: nativeId,
      title,
      href: nativeHref,
      onClick,
      ...nativeProps
    } = props;

    // Attempt to auto-detect `id` and `href` for LinkContext
    let linkId: string | null = trackingId ?? nativeId ?? title ?? makeTitleFromChildren(props.children);
    if (normalizeId) {
      linkId = makeIdFromString(linkId);
    }
    const href = trackingHref ?? nativeHref;

    const componentProps = {
      ...nativeProps,
      ...(ref ? { ref } : {}),
    };

    const locationStack = useLocationStack();
    if (!linkId || !href) {
      if (globalThis.objectiv.devTools) {
        const locationPath = globalThis.objectiv.devTools.getLocationPath(locationStack);

        if (!linkId) {
          globalThis.objectiv.devTools.TrackerConsole.error(
            `｢objectiv｣ Could not generate a valid id for LinkContext @ ${locationPath}. Please provide either the \`title\` or the \`objectiv.id\` property manually.`
          );
        }

        if (!href) {
          globalThis.objectiv.devTools.TrackerConsole.error(
            `｢objectiv｣ Could not generate a valid href for LinkContext @ ${locationPath}. Please provide the \`objectiv.href\` property manually.`
          );
        }
      }

      return React.createElement(Component, componentProps);
    }

    return (
      <LinkContextWrapper id={linkId} href={href}>
        {(trackingContext) =>
          React.createElement(Component, {
            ...componentProps,
            onClick: makeAnchorClickHandler({
              trackingContext,
              anchorHref: href,
              waitUntilTracked,
              onClick,
            }),
          })
        }
      </LinkContextWrapper>
    );
  }
) as <T>(props: PropsWithRef<TrackedLinkContextProps<T>>) => JSX.Element;
