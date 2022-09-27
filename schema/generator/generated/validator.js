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

export const ApplicationContext = z.object({
  id: z.string(),
  _type: z.literal('ApplicationContext'),
});

export const CookieIdContext = z.object({
  cookie_id: z.string(),
  id: z.string(),
  _type: z.literal('CookieIdContext'),
});

export const HttpContext = z.object({
  referrer: z.string(),
  user_agent: z.string(),
  remote_address: z.string(),
  id: z.string(),
  _type: z.literal('HttpContext'),
});

export const InputValueContext = z.object({
  value: z.string(),
  id: z.string(),
  _type: z.literal('InputValueContext'),
});

export const LocaleContext = z.object({
  language_code: z.string(),
  country_code: z.string(),
  id: z.string(),
  _type: z.literal('LocaleContext'),
});

export const PathContext = z.object({
  id: z.string(),
  _type: z.literal('PathContext'),
});

export const SessionContext = z.object({
  hit_number: z.bigint(),
  id: z.string(),
  _type: z.literal('SessionContext'),
});

export const MarketingContext = z.object({
  source: z.string(),
  medium: z.string(),
  campaign: z.string(),
  term: z.string(),
  content: z.string(),
  source_platform: z.string(),
  creative_format: z.string(),
  marketing_tactic: z.string(),
  id: z.string(),
  _type: z.literal('MarketingContext'),
});

export const IdentityContext = z.object({
  value: z.string(),
  id: z.string(),
  _type: z.literal('IdentityContext'),
});

export const InputContext = z.object({
  id: z.string(),
  _type: z.literal('InputContext'),
});

export const PressableContext = z.object({
  id: z.string(),
  _type: z.literal('PressableContext'),
});

export const LinkContext = z.object({
  href: z.string(),
  id: z.string(),
  _type: z.literal('LinkContext'),
});

export const RootLocationContext = z.object({
  id: z.string(),
  _type: z.literal('RootLocationContext'),
});

export const ExpandableContext = z.object({
  id: z.string(),
  _type: z.literal('ExpandableContext'),
});

export const MediaPlayerContext = z.object({
  id: z.string(),
  _type: z.literal('MediaPlayerContext'),
});

export const NavigationContext = z.object({
  id: z.string(),
  _type: z.literal('NavigationContext'),
});

export const OverlayContext = z.object({
  id: z.string(),
  _type: z.literal('OverlayContext'),
});

export const ContentContext = z.object({
  id: z.string(),
  _type: z.literal('ContentContext'),
});

