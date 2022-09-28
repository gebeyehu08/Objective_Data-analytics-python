/*
 * Copyright 2022 Objectiv B.V.
 */

import { z } from 'zod';

export const ContextTypes = z.enum([
  'AbstractContext',
  'AbstractGlobalContext',
  'AbstractLocationContext',
  'ApplicationContext',
  'ContentContext',
  'CookieIdContext',
  'ExpandableContext',
  'HttpContext',
  'IdentityContext',
  'InputContext',
  'InputValueContext',
  'LinkContext',
  'LocaleContext',
  'MarketingContext',
  'MediaPlayerContext',
  'NavigationContext',
  'OverlayContext',
  'PathContext',
  'PressableContext',
  'RootLocationContext',
  'SessionContext',
]);

// export const EventTypes = z.enum([
//   'AbstractEvent',
//   'ApplicationLoadedEvent',
//   'FailureEvent',
//   'HiddenEvent',
//   'InputChangeEvent',
//   'InteractiveEvent',
//   'MediaEvent',
//   'MediaLoadEvent',
//   'MediaPauseEvent',
//   'MediaStartEvent',
//   'MediaStopEvent',
//   'NonInteractiveEvent',
//   'PressEvent',
//   'SuccessEvent',
//   'VisibleEvent',
// ]);

// Custom refinements
const validateContextUniqueness = (contexts, ctx) => {
  const seenContexts = [];
  const duplicatedContexts = contexts.filter((context) => {
    if (seenContexts.find((seenContext) => seenContext._type === context._type && seenContext.id === context.id)) {
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

// TODO rewrite this as a generic refinement
const validateInputValueContexts = (event, ctx) => {
  const global_contexts = event.global_contexts ?? [];
  const location_stack = event.location_stack ?? [];
  const inputValueContexts = global_contexts.filter(
    (globalContext) => globalContext._type === ContextTypes.enum.InputValueContext
  );
  const inputContext = location_stack.find(
    (locationContext) => locationContext._type === ContextTypes.enum.InputContext
  );
  if (inputContext && inputValueContexts.find(({ id }) => id !== inputContext.id)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `All InputValueContext instances should have id: ${inputContext.id}`,
    });
  }
};

// const validateContextPresence = (type, errorMessage) => (event, ctx) => {
//   const contextFoundInLocationStack = event.location_stack.find((globalContext) => globalContext._type === type);
//   const contextFoundInGlobalContexts = event.global_contexts.find((locationContext) => locationContext._type === type);
//
//   if (!contextFoundInLocationStack && !contextFoundInGlobalContexts) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: errorMessage,
//     });
//   }
// };

// Contexts
const CommonContextAttributes = z.object({
  id: z.string(),
});

// Location Contexts
export const ContentContext = CommonContextAttributes.extend({
  _type: z.literal(ContextTypes.enum.ContentContext),
}).strict();

export const ExpandableContext = CommonContextAttributes.extend({
  _type: z.literal(ContextTypes.enum.ExpandableContext),
}).strict();

export const InputContext = CommonContextAttributes.extend({
  _type: z.literal(ContextTypes.enum.InputContext),
}).strict();

export const LinkContext = CommonContextAttributes.extend({
  _type: z.literal(ContextTypes.enum.LinkContext),
  href: z.string(),
}).strict();

export const MediaPlayerContext = CommonContextAttributes.extend({
  _type: z.literal(ContextTypes.enum.MediaPlayerContext),
}).strict();

export const NavigationContext = CommonContextAttributes.extend({
  _type: z.literal(ContextTypes.enum.NavigationContext),
}).strict();

export const OverlayContext = CommonContextAttributes.extend({
  _type: z.literal(ContextTypes.enum.OverlayContext),
}).strict();

export const PressableContext = CommonContextAttributes.extend({
  _type: z.literal(ContextTypes.enum.PressableContext),
}).strict();

export const RootLocationContext = CommonContextAttributes.extend({
  _type: z.literal(ContextTypes.enum.RootLocationContext),
}).strict();

// Global Contexts
export const ApplicationContext = CommonContextAttributes.extend({
  _type: z.literal(ContextTypes.enum.ApplicationContext),
}).strict();

export const CookieIdContext = CommonContextAttributes.extend({
  _type: z.literal(ContextTypes.enum.CookieIdContext),
  cookie_id: z.string(),
}).strict();

export const HttpContext = CommonContextAttributes.extend({
  _type: z.literal(ContextTypes.enum.HttpContext),
  referer: z.string(),
  user_agent: z.string(),
  remote_address: z.string().optional(),
}).strict();

export const IdentityContext = CommonContextAttributes.extend({
  _type: z.literal(ContextTypes.enum.IdentityContext),
  value: z.string(),
}).strict();

export const InputValueContext = CommonContextAttributes.extend({
  _type: z.literal(ContextTypes.enum.InputValueContext),
  value: z.string(),
}).strict();

export const LocaleContext = CommonContextAttributes.extend({
  _type: z.literal(ContextTypes.enum.LocaleContext),
  language_code: z.string().optional(), // TODO add refinement to validate ISO 639-1
  country_code: z.string().optional(), // TODO add refinement to validate ISO 3166-1 alpha-2
}).strict();

export const MarketingContext = CommonContextAttributes.extend({
  _type: z.literal(ContextTypes.enum.MarketingContext),
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
  _type: z.literal(ContextTypes.enum.PathContext),
}).strict();

export const SessionContext = CommonContextAttributes.extend({
  _type: z.literal(ContextTypes.enum.SessionContext),
  hit_number: z.number(),
}).strict();

// Location Stack and Global Contexts arrays
export const LocationStack = z
  .tuple([RootLocationContext])
  .rest(
    z.discriminatedUnion('_type', [
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
  )
  .superRefine(validateContextUniqueness);

// Events

const CommonEventAttributes = z.object({
  id: z.string().uuid(),
  global_contexts: GlobalContexts,
});
// .superRefine(
//   validateContextPresence(
//     ContextTypes.enum.ApplicationContext,
//     `All Events require ApplicationContext in their Global Contexts`
//   )
// );

export const InputChangeEvent = CommonEventAttributes.extend({
  _type: z.literal('InputChangeEvent'), // TODO use enums
  location_stack: LocationStack.refine(
    (locationStack) =>
      locationStack.find((locationContext) => locationContext._type === ContextTypes.enum.InputContext),
    { message: 'InputChangeEvent requires InputContext in its LocationStack' }
  ),
})
  .strict()
  .superRefine(validateInputValueContexts);

export const PressEvent = CommonEventAttributes.extend({
  _type: z.literal('PressEvent'), // TODO use enums
  location_stack: LocationStack.refine(
    (locationStack) =>
      locationStack.find(
        (locationContext) =>
          locationContext._type === ContextTypes.enum.PressableContext ||
          locationContext._type === ContextTypes.enum.LinkContext
      ),
    {
      message: 'PressEvent requires PressableContext or LinkContext in its LocationStack',
    }
  ),
}).strict();

// TODO we can use a discriminated union for much nicer error messages after this gets merged:
//  - https://github.com/colinhacks/zod/issues/1171
// z.discriminatedUnion('_type', [InputChangeEvent, PressEvent])

export const validate = z.union([InputChangeEvent, PressEvent]).safeParse;
