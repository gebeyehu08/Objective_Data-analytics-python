/*
 * Copyright 2022 Objectiv B.V.
 */

import { z } from "zod";
import crypto from "crypto";

// Some global enums
const LocationContextTypes = z.enum([
  'ContentContext',
  'ExpandableContext',
  'InputContext',
  'LinkContext',
  'MediaPlayerContext',
  'NavigationContext',
  'OverlayContext',
  'PressableContext',
  'RootLocationContext'
])

const GlobalContextTypes = z.enum([
  'ApplicationContext',
  'CookieIdContext',
  'HttpContext',
  'IdentityContext',
  'InputValueContext',
  'LocaleContext',
  'MarketingContext',
  'PathContext',
  'SessionContext',
])


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
    })
  });
}

const validateInputValueContexts = (event, ctx) => {
  const global_contexts = event.global_contexts ?? [];
  const location_stack = event.location_stack ?? [];
  const inputValueContexts = global_contexts.filter(
    globalContext => globalContext._type === GlobalContextTypes.enum.InputValueContext
  );
  const inputContext = location_stack.find(
    locationContext => locationContext._type === LocationContextTypes.enum.InputContext
  );
  if(inputValueContexts.find(({id}) => id !== inputContext.id)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `All InputValueContext instances should have id: ${inputContext.id}`,
    })
  }
}

const validateApplicationContextPresence = (global_contexts, ctx) => {
  const applicationContext = global_contexts.find(
    (globalContext) => globalContext._type === GlobalContextTypes.enum.ApplicationContext
  );

  if(!applicationContext) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `All Events require ApplicationContext in their Global Contexts`,
    })
  }
}

// Contexts
const CommonContextAttributes = z.object({
  id: z.string()
});

// Location Contexts
const ContentContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.ContentContext),
}).strict();

const ExpandableContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.ExpandableContext),
}).strict();

const InputContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.InputContext),
}).strict();

const LinkContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.LinkContext),
  href: z.string(),
}).strict();

const MediaPlayerContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.MediaPlayerContext),
}).strict();

const NavigationContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.NavigationContext),
}).strict();

const OverlayContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.OverlayContext),
}).strict();

const PressableContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.PressableContext),
}).strict();

const RootLocationContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.RootLocationContext),
}).strict();

// Global Contexts
const ApplicationContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.ApplicationContext),
}).strict();

const CookieIdContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.CookieIdContext),
  cookie_id: z.string()
}).strict();

const HttpContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.HttpContext),
  referer: z.string(),
  user_agent: z.string(),
  remote_address: z.string().optional()
}).strict();

const IdentityContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.IdentityContext),
  value: z.string()
}).strict();

const InputValueContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.InputValueContext),
  value: z.string()
}).strict();

const LocaleContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.LocaleContext),
  language_code: z.string().optional(), // TODO add refinement to validate ISO 639-1
  country_code: z.string().optional(), // TODO add refinement to validate ISO 3166-1 alpha-2
}).strict();

const MarketingContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.MarketingContext),
  source: z.string(),
  medium: z.string(),
  campaign: z.string(),
  term: z.string().optional,
  content: z.string().optional,
  source_platform: z.string().optional,
  creative_format: z.string().optional,
  marketing_tactic: z.string().optional,
}).strict();

const PathContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.PathContext),
}).strict();

const SessionContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.SessionContext),
  hit_number: z.number()
}).strict();


// Location Stack and Global Contexts arrays
const LocationStack = z
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
      PressableContext
    ])
  )
  .superRefine(validateContextUniqueness)
;

const GlobalContexts = z.array(
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
  ]))
  .superRefine(validateContextUniqueness)
  .superRefine(validateApplicationContextPresence)
;

// Events

const CommonEventAttributes = z.object({
  id: z.string().uuid(),
  global_contexts: GlobalContexts
});

const InputChangeEvent = CommonEventAttributes.extend({
  _type: z.literal('InputChangeEvent'), // TODO create enum of event names
  location_stack: LocationStack
    .refine(
      locationStack => locationStack.find(
        (locationContext) => locationContext._type === LocationContextTypes.enum.InputContext
      ),
      { message: 'InputChangeEvent requires InputContext in its LocationStack' }
    ),
})
  .superRefine(validateInputValueContexts)

// Some testing

console.log('RootLocationContext validation:', RootLocationContext.parse({
  _type: "RootLocationContext",
  id: 'test'
}))


console.log('LinkContext validation:', LinkContext.parse({
  _type: "LinkContext",
  id: 'test',
  href: '/test'
}))

console.log('LocationStack validation:', LocationStack.parse([
  {
    _type: "RootLocationContext",
    id: 'test'
  },
  {
    _type: "LinkContext",
    id: 'test',
    href: '/test'
  },
  {
    _type: "ContentContext",
    id: 'test2'
  }
]))

console.log('InputChangeEvent validation:', InputChangeEvent.parse({
  _type: 'InputChangeEvent',
  id: crypto.randomUUID(),
  location_stack: [
    {
      _type: "RootLocationContext",
      id: 'test'
    },
    {
      _type: "ContentContext",
      id: 'test2'
    },
    {
      _type: "InputContext",
      id: 'input'
    }
  ],
  global_contexts: [
    {
      _type: 'ApplicationContext',
      id: 'test'
    }
  ]
}))

console.log('InputChangeEvent validation:', InputChangeEvent.parse({
  _type: 'InputChangeEvent',
  id: crypto.randomUUID(),
  location_stack: [
    {
      _type: "RootLocationContext",
      id: 'test'
    },
    {
      _type: "InputContext",
      id: 'input'
    }
  ],
  global_contexts: [
    {
      _type: 'ApplicationContext',
      id: 'test'
    },
    {
      _type: 'InputValueContext',
      id: 'input',
      value: '123'
    }
  ]
}))