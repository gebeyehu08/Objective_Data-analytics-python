/*
 * Copyright 2022 Objectiv B.V.
 */

import { z } from "zod";
import crypto from "crypto";

// All Contexts
const CommonContextAttributes = z.object({
  id: z.string()
})

// Custom refinements
const validateContextUniqueness = (contexts, ctx) => {
  const seenContexts = [];
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
    })
  });
}

// Location Contexts
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

const ContentContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.ContentContext),
});

const ExpandableContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.ExpandableContext),
});

const InputContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.InputContext),
});

const LinkContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.LinkContext),
  href: z.string(),
});

const MediaPlayerContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.MediaPlayerContext),
});

const NavigationContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.NavigationContext),
});

const OverlayContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.OverlayContext),
});

const PressableContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.PressableContext),
});

const RootLocationContext = CommonContextAttributes.extend({
  _type: z.literal(LocationContextTypes.enum.RootLocationContext),
}).strict();

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

// Global Contexts
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

const ApplicationContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.ApplicationContext),
});

const CookieIdContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.CookieIdContext),
});

const HttpContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.HttpContext),
});

const IdentityContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.IdentityContext),
});

const InputValueContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.InputValueContext),
  value: z.string()
});

const LocaleContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.LocaleContext),
});

const MarketingContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.MarketingContext),
});

const PathContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.PathContext),
});

const SessionContext = CommonContextAttributes.extend({
  _type: z.literal(GlobalContextTypes.enum.SessionContext),
});

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
;

const InputChangeEvent = z.object({
  id: z.string().uuid(),
  _type: z.literal('InputChangeEvent'),
  location_stack: LocationStack.refine(
    locationStack => locationStack.find(
      (locationContext) => locationContext._type === 'InputContext'
    ),
    { message: 'InputChangeEvent requires InputContext in its LocationStack' }
  ),
  global_contexts: GlobalContexts.optional()
}).superRefine((event, ctx) => {
  const global_contexts = event.global_contexts ?? [];
  const location_stack = event.location_stack ?? [];
  const inputValueContexts = global_contexts.filter( globalContext => globalContext._type === 'InputValueContext');
  const inputContext = location_stack.find(locationContext => locationContext._type === 'InputContext');
  if(inputValueContexts.find(({id}) => id !== inputContext.id)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `All InputValueContext instances should have id: ${inputContext.id}`,
    })
  }
})

// Type inference

type InputChangeEvent = z.infer<typeof InputChangeEvent>;

const event: InputChangeEvent = {
  _type: "InputChangeEvent",
  id: crypto.randomUUID()
}

InputChangeEvent.parse(event);

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
  ]
}))

console.log('InputChangeEvent validation (should fail):', InputChangeEvent.parse({
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
      _type: 'InputValueContext',
      id: 'wrong',
      value: '123'
    }
  ]
}))