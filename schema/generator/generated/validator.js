/*
 * Copyright 2022 Objectiv B.V.
 */

import { z } from "zod";

/**
 * Context's _type discriminator attribute values
 */
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

/**
 * Event's _type discriminator attribute values
 */
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

/**
 * A GlobalContext describing in which app the event happens, like a website or iOS app.
 */
export const ApplicationContext = z.object({
  id: z.string(),
  _type: z.literal(ContextTypes.enum.ApplicationContext),
});

/**
 * Global context with information needed to reconstruct a user session.
 */
export const CookieIdContext = z.object({
  cookie_id: z.string(),
  id: z.string(),
  _type: z.literal(ContextTypes.enum.CookieIdContext),
});

/**
 * A GlobalContext describing meta information about the agent that sent the event.
 */
export const HttpContext = z.object({
  referrer: z.string(),
  user_agent: z.string(),
  remote_address: z.string().optional(),
  id: z.string(),
  _type: z.literal(ContextTypes.enum.HttpContext),
});

/**
 * A GlobalContext containing the value of a single input element. Multiple can be present.
 */
export const InputValueContext = z.object({
  value: z.string(),
  id: z.string(),
  _type: z.literal(ContextTypes.enum.InputValueContext),
});

/**
 * A GlobalContext describing the users' language (ISO 639-1) and country (ISO 3166-1 alpha-2).
 */
export const LocaleContext = z.object({
  language_code: z.string().optional(),
  country_code: z.string().optional(),
  id: z.string(),
  _type: z.literal(ContextTypes.enum.LocaleContext),
});

/**
 * A GlobalContext describing the path where the user is when an event is sent.
 */
export const PathContext = z.object({
  id: z.string(),
  _type: z.literal(ContextTypes.enum.PathContext),
});

/**
 * A GlobalContext describing meta information about the current session.
 */
export const SessionContext = z.object({
  hit_number: z.bigint(),
  id: z.string(),
  _type: z.literal(ContextTypes.enum.SessionContext),
});

/**
 * a context that captures marketing channel info, so users can do attribution, campaign 
 * effectiveness and other models.
 */
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

/**
 * A Global Context to track the identity of users across sessions, platforms, devices. Multiple can be present.
 * The `id` field is used to specify the scope of identification e.g. backend, md5(email), supplier_cookie, etc.
 * The `value` field should contain the unique identifier within that scope.
 */
export const IdentityContext = z.object({
  value: z.string(),
  id: z.string(),
  _type: z.literal(ContextTypes.enum.IdentityContext),
});

/**
 * A Location Context that describes an element that accepts user input, i.e. a form field.
 */
export const InputContext = z.object({
  id: z.string(),
  _type: z.literal(ContextTypes.enum.InputContext),
});

/**
 * An Location Context that describes an interactive element (like a link, button, icon), 
 * that the user can press and will trigger an Interactive Event.
 */
export const PressableContext = z.object({
  id: z.string(),
  _type: z.literal(ContextTypes.enum.PressableContext),
});

/**
 * A PressableContext that contains an href.
 */
export const LinkContext = z.object({
  href: z.string(),
  id: z.string(),
  _type: z.literal(ContextTypes.enum.LinkContext),
});

/**
 * A Location Context that uniquely represents the top-level UI location of the user.
 */
export const RootLocationContext = z.object({
  id: z.string(),
  _type: z.literal(ContextTypes.enum.RootLocationContext),
});

/**
 * A Location Context that describes a section of the UI that can expand & collapse.
 */
export const ExpandableContext = z.object({
  id: z.string(),
  _type: z.literal(ContextTypes.enum.ExpandableContext),
});

/**
 * A Location Context that describes a section of the UI containing a media player.
 */
export const MediaPlayerContext = z.object({
  id: z.string(),
  _type: z.literal(ContextTypes.enum.MediaPlayerContext),
});

/**
 * A Location Context that describes a section of the UI containing navigational elements, for example a menu.
 */
export const NavigationContext = z.object({
  id: z.string(),
  _type: z.literal(ContextTypes.enum.NavigationContext),
});

/**
 * A Location Context that describes a section of the UI that represents an overlay, i.e. a Modal.
 */
export const OverlayContext = z.object({
  id: z.string(),
  _type: z.literal(ContextTypes.enum.OverlayContext),
});

/**
 * A Location Context that describes a logical section of the UI that contains other Location Contexts. 
 * Enabling Data Science to analyze this section specifically.
 */
export const ContentContext = z.object({
  id: z.string(),
  _type: z.literal(ContextTypes.enum.ContentContext),
});

/**
 * The location stack is an ordered list (stack), that contains a hierarchy of location contexts that 
 * deterministically describes where an event took place from global to specific. 
 * The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
 */
export const LocationStack = z
  .array(
    z.discriminatedUnion('_type', [
      ContentContext,
      ExpandableContext,
      InputContext,
      LinkContext,
      MediaPlayerContext,
      NavigationContext,
      OverlayContext,
      PressableContext,
      RootLocationContext,
    ])
  );

/**
 * Global contexts add global / general information about the event. They carry information that is not 
 * related to where the Event originated (location), such as device, platform or business data.
 */
export const GlobalContexts = z
  .array(
    z.discriminatedUnion('_type', [
      ApplicationContext,
      CookieIdContext,
      HttpContext,
      IdentityContext,
      InputValueContext,
      LocaleContext,
      MarketingContext,
      PathContext,
      SessionContext,
    ])
  );

