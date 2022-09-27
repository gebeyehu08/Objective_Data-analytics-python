/*
 * Copyright 2022 Objectiv B.V.
 */

import { z } from "zod";

export const ContextTypes = z.enum([
  "AbstractContext",
  "AbstractGlobalContext",
  "AbstractLocationContext",
  "ApplicationContext",
  "ContentContext",
  "CookieIdContext",
  "ExpandableContext",
  "HttpContext",
  "IdentityContext",
  "InputContext",
  "InputValueContext",
  "LinkContext",
  "LocaleContext",
  "MarketingContext",
  "MediaPlayerContext",
  "NavigationContext",
  "OverlayContext",
  "PathContext",
  "PressableContext",
  "RootLocationContext",
  "SessionContext",
]);

export const EventTypes = z.enum([
  "AbstractEvent",
  "ApplicationLoadedEvent",
  "FailureEvent",
  "HiddenEvent",
  "InputChangeEvent",
  "InteractiveEvent",
  "MediaEvent",
  "MediaLoadEvent",
  "MediaPauseEvent",
  "MediaStartEvent",
  "MediaStopEvent",
  "NonInteractiveEvent",
  "PressEvent",
  "SuccessEvent",
  "VisibleEvent",
]);

