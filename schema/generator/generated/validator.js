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
  _type: z.literal(ContextTypes.enum.ApplicationContext),
});

export const CookieIdContext = z.object({
  cookie_id: z.string(),
  id: z.string(),
  _type: z.literal(ContextTypes.enum.CookieIdContext),
});

export const HttpContext = z.object({
  referrer: z.string(),
  user_agent: z.string(),
  remote_address: z.string().optional(),
  id: z.string(),
  _type: z.literal(ContextTypes.enum.HttpContext),
});

export const InputValueContext = z.object({
  value: z.string(),
  id: z.string(),
  _type: z.literal(ContextTypes.enum.InputValueContext),
});

export const LocaleContext = z.object({
  language_code: z.string().optional(),
  country_code: z.string().optional(),
  id: z.string(),
  _type: z.literal(ContextTypes.enum.LocaleContext),
});

export const PathContext = z.object({
  id: z.string(),
  _type: z.literal(ContextTypes.enum.PathContext),
});

export const SessionContext = z.object({
  hit_number: z.bigint(),
  id: z.string(),
  _type: z.literal(ContextTypes.enum.SessionContext),
});

export const MarketingContext = z.object({
  source: z.string(),
  medium: z.string(),
  campaign: z.string(),
  term: z.string().optional(),
  content: z.string().optional(),
  source_platform: z.string().optional(),
  creative_format: z.string().optional(),
  marketing_tactic: z.string().optional(),
  id: z.string(),
  _type: z.literal(ContextTypes.enum.MarketingContext),
});

export const IdentityContext = z.object({
  value: z.string(),
  id: z.string(),
  _type: z.literal(ContextTypes.enum.IdentityContext),
});

export const InputContext = z.object({
  id: z.string(),
  _type: z.literal(ContextTypes.enum.InputContext),
});

export const PressableContext = z.object({
  id: z.string(),
  _type: z.literal(ContextTypes.enum.PressableContext),
});

export const LinkContext = z.object({
  href: z.string(),
  id: z.string(),
  _type: z.literal(ContextTypes.enum.LinkContext),
});

export const RootLocationContext = z.object({
  id: z.string(),
  _type: z.literal(ContextTypes.enum.RootLocationContext),
});

export const ExpandableContext = z.object({
  id: z.string(),
  _type: z.literal(ContextTypes.enum.ExpandableContext),
});

export const MediaPlayerContext = z.object({
  id: z.string(),
  _type: z.literal(ContextTypes.enum.MediaPlayerContext),
});

export const NavigationContext = z.object({
  id: z.string(),
  _type: z.literal(ContextTypes.enum.NavigationContext),
});

export const OverlayContext = z.object({
  id: z.string(),
  _type: z.literal(ContextTypes.enum.OverlayContext),
});

export const ContentContext = z.object({
  id: z.string(),
  _type: z.literal(ContextTypes.enum.ContentContext),
});

