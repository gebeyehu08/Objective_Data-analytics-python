/*
 * Copyright 2022 Objectiv B.V.
 */

import { z } from "zod";
import { RefinementCtx } from "zod/lib/types";

// Some global enums
const LocationContextTypes = z.enum([
  "ContentContext",
  "ExpandableContext",
  "InputContext",
  "LinkContext",
  "MediaPlayerContext",
  "NavigationContext",
  "OverlayContext",
  "PressableContext",
  "RootLocationContext",
]);

const GlobalContextTypes = z.enum([
  "ApplicationContext",
  "CookieIdContext",
  "HttpContext",
  "IdentityContext",
  "InputValueContext",
  "LocaleContext",
  "MarketingContext",
  "PathContext",
  "SessionContext",
]);

// Custom refinements
type Context = { _type: string; id: string };
const validateContextUniqueness = (contexts: Context[], ctx: RefinementCtx) => {
  const seenContexts: Context[] = [];
  const duplicatedContexts = contexts.filter((context) => {
    if (
      seenContexts.find(
        (seenContext) =>
          seenContext._type === context._type && seenContext.id === context.id
      )
    ) {
      return true;
    }

    seenContexts.push(context);
    return false;
  });

  duplicatedContexts.forEach((duplicatedContext) => {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `No duplicate Contexts allowed: ${duplicatedContext._type}:${duplicatedContext.id}`,
    });
  });
};

type Event = {
  _type: string;
  id: string;
  global_contexts: Context[];
  location_stack: Context[];
};
const validateInputValueContexts = (event: Event, ctx: RefinementCtx) => {
  const global_contexts = event.global_contexts ?? [];
  const location_stack = event.location_stack ?? [];
  const inputValueContexts = global_contexts.filter(
    (globalContext: Context) =>
      globalContext._type === GlobalContextTypes.enum.InputValueContext
  );
  const inputContext: Context | undefined = location_stack.find(
    (locationContext: Context) =>
      locationContext._type === LocationContextTypes.enum.InputContext
  );
  if (
    inputContext &&
    inputValueContexts.find(({ id }: Context) => id !== inputContext.id)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `All InputValueContext instances should have id: ${inputContext.id}`,
    });
  }
};

const validateApplicationContextPresence = (
  global_contexts: Context[],
  ctx: RefinementCtx
) => {
  const applicationContext = global_contexts.find(
    (globalContext) =>
      globalContext._type === GlobalContextTypes.enum.ApplicationContext
  );

  if (!applicationContext) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `All Events require ApplicationContext in their Global Contexts`,
    });
  }
};

// Contexts
const CommonContextAttributes = z.object({
  id: z.string(),
});

// Location Contexts
export const ContentContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.ContentContext),
}).strict();

export const ExpandableContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.ExpandableContext),
}).strict();

export const InputContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.InputContext),
}).strict();

export const LinkContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.LinkContext),
  href: z.string(),
}).strict();

export const MediaPlayerContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.MediaPlayerContext),
}).strict();

export const NavigationContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.NavigationContext),
}).strict();

export const OverlayContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.OverlayContext),
}).strict();

export const PressableContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.PressableContext),
}).strict();

export const RootLocationContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.RootLocationContext),
}).strict();

// Global Contexts
export const ApplicationContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.ApplicationContext),
}).strict();

export const CookieIdContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.CookieIdContext),
  cookie_id: z.string(),
}).strict();

export const HttpContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.HttpContext),
  referer: z.string(),
  user_agent: z.string(),
  remote_address: z.string().optional(),
}).strict();

export const IdentityContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.IdentityContext),
  value: z.string(),
}).strict();

export const InputValueContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.InputValueContext),
  value: z.string(),
}).strict();

export const LocaleContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.LocaleContext),
  language_code: z.string().optional(), // TODO add refinement to validate ISO 639-1
  country_code: z.string().optional(), // TODO add refinement to validate ISO 3166-1 alpha-2
}).strict();

export const MarketingContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.MarketingContext),
  source: z.string(),
  medium: z.string(),
  campaign: z.string(),
  term: z.string().optional(),
  content: z.string().optional(),
  source_platform: z.string().optional(),
  creative_format: z.string().optional(),
  marketing_tactic: z.string().optional(),
}).strict();

export const PathContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.PathContext),
}).strict();

export const SessionContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.SessionContext),
  hit_number: z.number(),
}).strict();

// Location Stack and Global Contexts arrays
export const LocationStack = z
  .tuple([RootLocationContext])
  .rest(
    z.discriminatedUnion("_type", [
      ContentContext,
      ExpandableContext,
      InputContext,
      LinkContext,
      MediaPlayerContext,
      NavigationContext,
      OverlayContext,
      PressableContext,
    ])
  )
  .superRefine(validateContextUniqueness);

export const GlobalContexts = z
  .array(
    z.discriminatedUnion("_type", [
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
  )
  .superRefine(validateContextUniqueness)
  .superRefine(validateApplicationContextPresence);

// Events

const CommonEventAttributes = z.object({
  id: z.string().uuid(),
  global_contexts: GlobalContexts,
});

export const InputChangeEvent = CommonEventAttributes.extend({
  _type: z.literal("InputChangeEvent"), // TODO create enum of event names
  location_stack: LocationStack.refine(
    (locationStack) =>
      locationStack.find(
        (locationContext) =>
          locationContext._type === LocationContextTypes.enum.InputContext
      ),
    { message: "InputChangeEvent requires InputContext in its LocationStack" }
  ),
}).superRefine(validateInputValueContexts);
