/*
 * Copyright 2022 Objectiv B.V.
 */

const { z } = require('zod');

/**
 * This map is used by refinements to easily access required context entities and run validation checks.
 */
let entityMap;

/**
 * A refinement that checks whether the given context type is present in the subject contexts or Event
 */
const requiresContext =
  ({ scope }) =>
  (subject, ctx) => {
    const allContexts = Array.isArray(subject) ? subject : [...subject.location_stack, ...subject.global_contexts];

    scope.forEach(({ context, position }) => {
      const contextIndex = allContexts.findIndex(
        (contextToVerify) => entityMap[context].safeParse(contextToVerify).success
      );

      if (contextIndex < 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${context} is required.` });
      }

      if (contextIndex >= 0 && position !== undefined && position !== contextIndex) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${context} is required at position ${position}.` });
      }
    });
  };

/**
 * A refinement that checks whether the given context type is present only once in the subject contexts or Event
 */
const uniqueContext =
  ({ scope }) =>
  (subject, ctx) => {
    const findDuplicatedContexts = (allContexts, includeContexts, excludeContexts, by) => {
      const contexts = allContexts.filter(({ _type }) => {
        if (excludeContexts) {
          return !excludeContexts.includes(_type);
        }
        if (includeContexts) {
          return includeContexts.includes(_type);
        }

        return true;
      });

      const seenContexts = [];

      return contexts.filter((contextEntity) => {
        if (
          seenContexts.find((seenContext) => {
            let matchCount = 0;
            by.forEach((propertyToMatch) => {
              const seenProperty = seenContext[propertyToMatch];
              const contextProperty = contextEntity[propertyToMatch];

              if (seenProperty !== undefined && contextProperty !== undefined && seenProperty === contextProperty) {
                matchCount++;
              }
            });
            return matchCount === by.length;
          })
        ) {
          return true;
        }

        seenContexts.push(contextEntity);
        return false;
      });
    };

    scope.forEach(({ includeContexts, excludeContexts, by }) => {
      let duplicatedContexts;
      if (Array.isArray(subject)) {
        duplicatedContexts = findDuplicatedContexts(subject, includeContexts, excludeContexts, by);
      } else {
        duplicatedContexts = [
          ...findDuplicatedContexts(subject.location_stack, includeContexts, excludeContexts, by),
          ...findDuplicatedContexts(subject.global_contexts, includeContexts, excludeContexts, by),
        ];
      }

      duplicatedContexts.forEach((duplicatedContext) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `No duplicate Contexts allowed (same \`${by.join('` and `')}\`): ${duplicatedContext._type}:${
            duplicatedContext.id
          }`,
        });
      });
    });
  };

/**
 * A refinement that checks whether the specified property matches between two contexts.
 */
const matchContextProperty =
  ({ scope }) =>
  (subject, ctx) => {
    const allContexts = Array.isArray(subject) ? subject : [...subject.location_stack, ...subject.global_contexts];

    scope.forEach(({ contextA, contextB, property }) => {
      const contexts = allContexts.filter(({ _type }) => _type === contextA || _type === contextB);

      const groupsByProperty = contexts.reduce((accumulator, item) => {
        (accumulator[item[property]] = accumulator[item[property]] || []).push(item);
        return accumulator;
      }, {});

      if (Object.keys(groupsByProperty).length > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `\`${contextA}\` and \`${contextB}\` must have matching \`${property}\` properties.`,
        });
      }
    });
  };

/**
 * Context's _type discriminator attribute values
 */
const ContextTypes = z.enum([
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

/**
 * Event's _type discriminator attribute values
 */
const EventTypes = z.enum([
  'AbstractEvent',
  'ApplicationLoadedEvent',
  'FailureEvent',
  'HiddenEvent',
  'InputChangeEvent',
  'InteractiveEvent',
  'MediaEvent',
  'MediaLoadEvent',
  'MediaPauseEvent',
  'MediaStartEvent',
  'MediaStopEvent',
  'NonInteractiveEvent',
  'PressEvent',
  'SuccessEvent',
  'VisibleEvent',
]);

/**
 * A GlobalContext describing in which app the event happens, like a website or iOS app.
 */
const ApplicationContext = z.object({
  /**
   * An ordered list of the parents of this Context, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Hardcoded to the Context name.
   */
  _type: z.literal(ContextTypes.enum.ApplicationContext),
}).strict();

/**
 * A Location Context that describes a logical section of the UI that contains other Location Contexts.
 * Enabling Data Science to analyze this section specifically.
 */
const ContentContext = z.object({
  /**
   * An ordered list of the parents of this Context, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Hardcoded to the Context name.
   */
  _type: z.literal(ContextTypes.enum.ContentContext),
}).strict();

/**
 * Global context with information needed to reconstruct a user session.
 */
const CookieIdContext = z.object({
  /**
   * An ordered list of the parents of this Context, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Hardcoded to the Context name.
   */
  _type: z.literal(ContextTypes.enum.CookieIdContext),
  /**
   * Unique identifier from the session cookie.
   */
  cookie_id: z.string(),
}).strict();

/**
 * A Location Context that describes a section of the UI that can expand & collapse.
 */
const ExpandableContext = z.object({
  /**
   * An ordered list of the parents of this Context, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Hardcoded to the Context name.
   */
  _type: z.literal(ContextTypes.enum.ExpandableContext),
}).strict();

/**
 * A GlobalContext describing meta information about the agent that sent the event.
 */
const HttpContext = z.object({
  /**
   * An ordered list of the parents of this Context, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Hardcoded to the Context name.
   */
  _type: z.literal(ContextTypes.enum.HttpContext),
  /**
   * Full URL to HTTP referrer of the current page.
   */
  referrer: z.string(),
  /**
   * User-agent of the agent that sent the event.
   */
  user_agent: z.string(),
  /**
   * (public) IP address of the agent that sent the event.
   */
  remote_address: z.string().nullable(),
}).strict();

/**
 * A Global Context to track the identity of users across sessions, platforms, devices. Multiple can be present.
 * The `id` field is used to specify the scope of identification e.g. backend, md5(email), supplier_cookie, etc.
 * The `value` field should contain the unique identifier within that scope.
 */
const IdentityContext = z.object({
  /**
   * An ordered list of the parents of this Context, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Hardcoded to the Context name.
   */
  _type: z.literal(ContextTypes.enum.IdentityContext),
  /**
   * The unique identifier for this user/group/entity within the scope defined by `id`.
   */
  value: z.string(),
}).strict();

/**
 * A Location Context that describes an element that accepts user input, i.e. a form field.
 */
const InputContext = z.object({
  /**
   * An ordered list of the parents of this Context, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Hardcoded to the Context name.
   */
  _type: z.literal(ContextTypes.enum.InputContext),
}).strict();

/**
 * A GlobalContext containing the value of a single input element. Multiple can be present.
 */
const InputValueContext = z.object({
  /**
   * An ordered list of the parents of this Context, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Hardcoded to the Context name.
   */
  _type: z.literal(ContextTypes.enum.InputValueContext),
  /**
   * The value of the input element.
   */
  value: z.string(),
}).strict();

/**
 * A PressableContext that contains a destination (href).
 */
const LinkContext = z.object({
  /**
   * An ordered list of the parents of this Context, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Hardcoded to the Context name.
   */
  _type: z.literal(ContextTypes.enum.LinkContext),
  /**
   * URL (href) the link points to.
   */
  href: z.string(),
}).strict();

/**
 * A GlobalContext describing the users' language (ISO 639-1) and country (ISO 3166-1 alpha-2).
 */
const LocaleContext = z.object({
  /**
   * An ordered list of the parents of this Context, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Hardcoded to the Context name.
   */
  _type: z.literal(ContextTypes.enum.LocaleContext),
  /**
   * Case sensitive ISO 639-1 language code. E.g. en, nl, fr, de, it, etc.
   */
  language_code: z.string().nullable(),
  /**
   * Case sensitive ISO 3166-1 alpha-2 country code. E.g. US, NL, FR, DE, IT, etc.
   */
  country_code: z.string().nullable(),
}).strict();

/**
 * a context that captures marketing channel info, so users can do attribution, campaign
 * effectiveness and other models.
 */
const MarketingContext = z.object({
  /**
   * An ordered list of the parents of this Context, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Hardcoded to the Context name.
   */
  _type: z.literal(ContextTypes.enum.MarketingContext),
  /**
   * The advertiser, site, publication, etc.
   */
  source: z.string(),
  /**
   * Advertising or marketing medium: cpc, banner, email newsletter, etc.
   */
  medium: z.string(),
  /**
   * Campaign name, slogan, promo code, etc.
   */
  campaign: z.string(),
  /**
   * Search keywords.
   */
  term: z.string().nullable(),
  /**
   * To differentiate similar content, or links within the same ad.
   */
  content: z.string().nullable(),
  /**
   * Identifies the platform where the marketing activity was undertaken.
   */
  source_platform: z.string().nullable(),
  /**
   * Identifies the creative used (e.g., skyscraper, banner, etc).
   */
  creative_format: z.string().nullable(),
  /**
   * Identifies the marketing tactic used (e.g., onboarding, retention, acquisition etc).
   */
  marketing_tactic: z.string().nullable(),
}).strict();

/**
 * A Location Context that describes a section of the UI containing a media player.
 */
const MediaPlayerContext = z.object({
  /**
   * An ordered list of the parents of this Context, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Hardcoded to the Context name.
   */
  _type: z.literal(ContextTypes.enum.MediaPlayerContext),
}).strict();

/**
 * A Location Context that describes a section of the UI containing navigational elements, for example a menu.
 */
const NavigationContext = z.object({
  /**
   * An ordered list of the parents of this Context, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Hardcoded to the Context name.
   */
  _type: z.literal(ContextTypes.enum.NavigationContext),
}).strict();

/**
 * A Location Context that describes a section of the UI that represents an overlay, i.e. a Modal.
 */
const OverlayContext = z.object({
  /**
   * An ordered list of the parents of this Context, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Hardcoded to the Context name.
   */
  _type: z.literal(ContextTypes.enum.OverlayContext),
}).strict();

/**
 * A GlobalContext describing the path where the user is when an event is sent.
 */
const PathContext = z.object({
  /**
   * An ordered list of the parents of this Context, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Hardcoded to the Context name.
   */
  _type: z.literal(ContextTypes.enum.PathContext),
}).strict();

/**
 * A Location Context that uniquely represents the top-level UI location of the user.
 */
const RootLocationContext = z.object({
  /**
   * An ordered list of the parents of this Context, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Hardcoded to the Context name.
   */
  _type: z.literal(ContextTypes.enum.RootLocationContext),
}).strict();

/**
 * A GlobalContext describing meta information about the current session.
 */
const SessionContext = z.object({
  /**
   * An ordered list of the parents of this Context, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Hardcoded to the Context name.
   */
  _type: z.literal(ContextTypes.enum.SessionContext),
  /**
   * Hit counter relative to the current session, this event originated in.
   */
  hit_number: z.number(),
}).strict();

/**
 * A Location Context that describes an interactive element (like a link, button, icon),
 * that the user can press and will trigger an Interactive Event.
 */
const PressableContextEntity = z.object({
  /**
   * An ordered list of the parents of this Context, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Hardcoded to the Context name.
   */
  _type: z.literal(ContextTypes.enum.PressableContext),
}).strict();

/**
 * A Location Context that describes an interactive element (like a link, button, icon),
 * that the user can press and will trigger an Interactive Event.
 */
const PressableContext = z.discriminatedUnion('_type', [
  z.object({
    /**
     * An ordered list of the parents of this Context, itself included as the last element.
     */
    _types: z.array(z.string()),
    /**
     * A unique string identifier to be combined with the Context Type (`_type`)
     * for Context instance uniqueness.
     */
    id: z.string(),
    /**
     * A string literal used during serialization. Hardcoded to the Context name.
     */
    _type: z.literal(ContextTypes.enum.PressableContext),
  }).strict(),
  LinkContext,
]);

/**
 * The LocationStack is an ordered list (a stack) containing a hierarchy of LocationContexts, which deterministically
 * describes where in the UI of an application an Event took place.
 */
const LocationStack = z
  .array(
    z.discriminatedUnion('_type', [
      ContentContext,
      ExpandableContext,
      InputContext,
      LinkContext,
      MediaPlayerContext,
      NavigationContext,
      OverlayContext,
      RootLocationContext,
      PressableContextEntity,
    ])
  )
  .superRefine(
    uniqueContext({
      scope: [
        {
          by: ['_type', 'id'],
        },
      ],
    })
  );

/**
 * GlobalContexts add global/general information about the state in which an Event happened, such as a user's identity and
 * marketing information. They do not carry information related to where the Event originated (location), which instead is
 * captured by the LocationStack.
 */
const GlobalContexts = z
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
  .superRefine(
    requiresContext({
      scope: [
        {
          context: ContextTypes.enum.ApplicationContext,
        },
      ],
    })
  )
  .superRefine(
    uniqueContext({
      scope: [
        {
          excludeContexts: [ContextTypes.enum.InputValueContext],
          by: ['_type', 'id'],
        },
        {
          includeContexts: [ContextTypes.enum.InputValueContext],
          by: ['_type', 'id', 'value'],
        },
      ],
    })
  );

/**
 * A NonInteractive event that is emitted after an application (e.g. SPA) has finished loading.
 */
const ApplicationLoadedEvent = z.object({
  /**
   * The version of the Objectiv Taxonomy Schema used to generate this event.
   */
  _schema_version: z.string().optional(),
  /**
   * An ordered list of the parents of this Event, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * The LocationStack is an ordered list (a stack) containing a hierarchy of LocationContexts, which deterministically
   * describes where in the UI of an application an Event took place.
   */
  location_stack: LocationStack,
  /**
   * GlobalContexts add global/general information about the state in which an Event happened, such as a user's identity and
   * marketing information. They do not carry information related to where the Event originated (location), which instead is
   * captured by the LocationStack.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Hardcoded to the Event name.
   */
  _type: z.literal(EventTypes.enum.ApplicationLoadedEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.number(),
}).strict();

/**
 * A NonInteractiveEvent that is sent when a user action results in an error,
 * like an invalid email when sending a form.
 */
const FailureEvent = z.object({
  /**
   * The version of the Objectiv Taxonomy Schema used to generate this event.
   */
  _schema_version: z.string().optional(),
  /**
   * An ordered list of the parents of this Event, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * The LocationStack is an ordered list (a stack) containing a hierarchy of LocationContexts, which deterministically
   * describes where in the UI of an application an Event took place.
   */
  location_stack: LocationStack,
  /**
   * GlobalContexts add global/general information about the state in which an Event happened, such as a user's identity and
   * marketing information. They do not carry information related to where the Event originated (location), which instead is
   * captured by the LocationStack.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Hardcoded to the Event name.
   */
  _type: z.literal(EventTypes.enum.FailureEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.number(),
  /**
   * Failure message.
   */
  message: z.string(),
}).strict();

/**
 * A NonInteractiveEvent that's emitted after a LocationContext has become invisible.
 */
const HiddenEvent = z.object({
  /**
   * The version of the Objectiv Taxonomy Schema used to generate this event.
   */
  _schema_version: z.string().optional(),
  /**
   * An ordered list of the parents of this Event, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * The LocationStack is an ordered list (a stack) containing a hierarchy of LocationContexts, which deterministically
   * describes where in the UI of an application an Event took place.
   */
  location_stack: LocationStack,
  /**
   * GlobalContexts add global/general information about the state in which an Event happened, such as a user's identity and
   * marketing information. They do not carry information related to where the Event originated (location), which instead is
   * captured by the LocationStack.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Hardcoded to the Event name.
   */
  _type: z.literal(EventTypes.enum.HiddenEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.number(),
}).strict();

/**
 * Event triggered when user input is modified.
 */
const InputChangeEvent = z.object({
  /**
   * The version of the Objectiv Taxonomy Schema used to generate this event.
   */
  _schema_version: z.string().optional(),
  /**
   * An ordered list of the parents of this Event, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * The LocationStack is an ordered list (a stack) containing a hierarchy of LocationContexts, which deterministically
   * describes where in the UI of an application an Event took place.
   */
  location_stack: LocationStack,
  /**
   * GlobalContexts add global/general information about the state in which an Event happened, such as a user's identity and
   * marketing information. They do not carry information related to where the Event originated (location), which instead is
   * captured by the LocationStack.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Hardcoded to the Event name.
   */
  _type: z.literal(EventTypes.enum.InputChangeEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.number(),
}).strict()
  .superRefine(
    requiresContext({
      scope: [
        {
          context: ContextTypes.enum.InputContext,
        },
      ],
    })
  )
  .superRefine(
    matchContextProperty({
      scope: [
        {
          contextA: ContextTypes.enum.InputContext,
          contextB: ContextTypes.enum.InputValueContext,
          property: 'id',
        },
      ],
    })
  );

/**
 * The parent of Events that are the direct result of a user interaction, e.g. a button click.
 */
const InteractiveEvent = z.object({
  /**
   * The version of the Objectiv Taxonomy Schema used to generate this event.
   */
  _schema_version: z.string().optional(),
  /**
   * An ordered list of the parents of this Event, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * The LocationStack is an ordered list (a stack) containing a hierarchy of LocationContexts, which deterministically
   * describes where in the UI of an application an Event took place.
   */
  location_stack: LocationStack,
  /**
   * GlobalContexts add global/general information about the state in which an Event happened, such as a user's identity and
   * marketing information. They do not carry information related to where the Event originated (location), which instead is
   * captured by the LocationStack.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Hardcoded to the Event name.
   */
  _type: z.literal(EventTypes.enum.InteractiveEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.number(),
}).strict()
  .superRefine(
    requiresContext({
      scope: [
        {
          context: ContextTypes.enum.RootLocationContext,
          position: 0,
        },
      ],
    })
  )
  .superRefine(
    requiresContext({
      scope: [
        {
          context: ContextTypes.enum.PathContext,
        },
      ],
    })
  );

/**
 * The parent of non-interactive events that are triggered by a media player.
 * It requires a MediaPlayerContext to detail the origin of the event.
 */
const MediaEvent = z.object({
  /**
   * The version of the Objectiv Taxonomy Schema used to generate this event.
   */
  _schema_version: z.string().optional(),
  /**
   * An ordered list of the parents of this Event, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * The LocationStack is an ordered list (a stack) containing a hierarchy of LocationContexts, which deterministically
   * describes where in the UI of an application an Event took place.
   */
  location_stack: LocationStack,
  /**
   * GlobalContexts add global/general information about the state in which an Event happened, such as a user's identity and
   * marketing information. They do not carry information related to where the Event originated (location), which instead is
   * captured by the LocationStack.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Hardcoded to the Event name.
   */
  _type: z.literal(EventTypes.enum.MediaEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.number(),
}).strict()
  .superRefine(
    requiresContext({
      scope: [
        {
          context: ContextTypes.enum.MediaPlayerContext,
        },
      ],
    })
  );

/**
 * A MediaEvent that's emitted after a media item completes loading.
 */
const MediaLoadEvent = z.object({
  /**
   * The version of the Objectiv Taxonomy Schema used to generate this event.
   */
  _schema_version: z.string().optional(),
  /**
   * An ordered list of the parents of this Event, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * The LocationStack is an ordered list (a stack) containing a hierarchy of LocationContexts, which deterministically
   * describes where in the UI of an application an Event took place.
   */
  location_stack: LocationStack,
  /**
   * GlobalContexts add global/general information about the state in which an Event happened, such as a user's identity and
   * marketing information. They do not carry information related to where the Event originated (location), which instead is
   * captured by the LocationStack.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Hardcoded to the Event name.
   */
  _type: z.literal(EventTypes.enum.MediaLoadEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.number(),
}).strict();

/**
 * A MediaEvent that's emitted after a media item pauses playback.
 */
const MediaPauseEvent = z.object({
  /**
   * The version of the Objectiv Taxonomy Schema used to generate this event.
   */
  _schema_version: z.string().optional(),
  /**
   * An ordered list of the parents of this Event, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * The LocationStack is an ordered list (a stack) containing a hierarchy of LocationContexts, which deterministically
   * describes where in the UI of an application an Event took place.
   */
  location_stack: LocationStack,
  /**
   * GlobalContexts add global/general information about the state in which an Event happened, such as a user's identity and
   * marketing information. They do not carry information related to where the Event originated (location), which instead is
   * captured by the LocationStack.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Hardcoded to the Event name.
   */
  _type: z.literal(EventTypes.enum.MediaPauseEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.number(),
}).strict();

/**
 * A MediaEvent that's emitted after a media item starts playback.
 */
const MediaStartEvent = z.object({
  /**
   * The version of the Objectiv Taxonomy Schema used to generate this event.
   */
  _schema_version: z.string().optional(),
  /**
   * An ordered list of the parents of this Event, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * The LocationStack is an ordered list (a stack) containing a hierarchy of LocationContexts, which deterministically
   * describes where in the UI of an application an Event took place.
   */
  location_stack: LocationStack,
  /**
   * GlobalContexts add global/general information about the state in which an Event happened, such as a user's identity and
   * marketing information. They do not carry information related to where the Event originated (location), which instead is
   * captured by the LocationStack.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Hardcoded to the Event name.
   */
  _type: z.literal(EventTypes.enum.MediaStartEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.number(),
}).strict();

/**
 * A MediaEvent that's emitted after a media item stops playback.
 */
const MediaStopEvent = z.object({
  /**
   * The version of the Objectiv Taxonomy Schema used to generate this event.
   */
  _schema_version: z.string().optional(),
  /**
   * An ordered list of the parents of this Event, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * The LocationStack is an ordered list (a stack) containing a hierarchy of LocationContexts, which deterministically
   * describes where in the UI of an application an Event took place.
   */
  location_stack: LocationStack,
  /**
   * GlobalContexts add global/general information about the state in which an Event happened, such as a user's identity and
   * marketing information. They do not carry information related to where the Event originated (location), which instead is
   * captured by the LocationStack.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Hardcoded to the Event name.
   */
  _type: z.literal(EventTypes.enum.MediaStopEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.number(),
}).strict();

/**
 * The parent of Events that are not directly triggered by a user action.
 */
const NonInteractiveEvent = z.object({
  /**
   * The version of the Objectiv Taxonomy Schema used to generate this event.
   */
  _schema_version: z.string().optional(),
  /**
   * An ordered list of the parents of this Event, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * The LocationStack is an ordered list (a stack) containing a hierarchy of LocationContexts, which deterministically
   * describes where in the UI of an application an Event took place.
   */
  location_stack: LocationStack,
  /**
   * GlobalContexts add global/general information about the state in which an Event happened, such as a user's identity and
   * marketing information. They do not carry information related to where the Event originated (location), which instead is
   * captured by the LocationStack.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Hardcoded to the Event name.
   */
  _type: z.literal(EventTypes.enum.NonInteractiveEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.number(),
}).strict();

/**
 * An InteractiveEvent that is sent when a user presses on a pressable element
 * (like a link, button, icon).
 */
const PressEvent = z.object({
  /**
   * The version of the Objectiv Taxonomy Schema used to generate this event.
   */
  _schema_version: z.string().optional(),
  /**
   * An ordered list of the parents of this Event, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * The LocationStack is an ordered list (a stack) containing a hierarchy of LocationContexts, which deterministically
   * describes where in the UI of an application an Event took place.
   */
  location_stack: LocationStack,
  /**
   * GlobalContexts add global/general information about the state in which an Event happened, such as a user's identity and
   * marketing information. They do not carry information related to where the Event originated (location), which instead is
   * captured by the LocationStack.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Hardcoded to the Event name.
   */
  _type: z.literal(EventTypes.enum.PressEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.number(),
}).strict()
  .superRefine(
    requiresContext({
      scope: [
        {
          context: ContextTypes.enum.PressableContext,
        },
      ],
    })
  );

/**
 * A NonInteractiveEvent that is sent when a user action is successfully completed,
 * like sending an email form.
 */
const SuccessEvent = z.object({
  /**
   * The version of the Objectiv Taxonomy Schema used to generate this event.
   */
  _schema_version: z.string().optional(),
  /**
   * An ordered list of the parents of this Event, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * The LocationStack is an ordered list (a stack) containing a hierarchy of LocationContexts, which deterministically
   * describes where in the UI of an application an Event took place.
   */
  location_stack: LocationStack,
  /**
   * GlobalContexts add global/general information about the state in which an Event happened, such as a user's identity and
   * marketing information. They do not carry information related to where the Event originated (location), which instead is
   * captured by the LocationStack.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Hardcoded to the Event name.
   */
  _type: z.literal(EventTypes.enum.SuccessEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.number(),
  /**
   * Success message.
   */
  message: z.string(),
}).strict();

/**
 * A NonInteractiveEvent that's emitted after a section LocationContext has become visible.
 */
const VisibleEvent = z.object({
  /**
   * The version of the Objectiv Taxonomy Schema used to generate this event.
   */
  _schema_version: z.string().optional(),
  /**
   * An ordered list of the parents of this Event, itself included as the last element.
   */
  _types: z.array(z.string()),
  /**
   * The LocationStack is an ordered list (a stack) containing a hierarchy of LocationContexts, which deterministically
   * describes where in the UI of an application an Event took place.
   */
  location_stack: LocationStack,
  /**
   * GlobalContexts add global/general information about the state in which an Event happened, such as a user's identity and
   * marketing information. They do not carry information related to where the Event originated (location), which instead is
   * captured by the LocationStack.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Hardcoded to the Event name.
   */
  _type: z.literal(EventTypes.enum.VisibleEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.number(),
}).strict();

/**
 * Set validators in validatorMap for the refinements.
 */
entityMap = {
  'ApplicationContext': ApplicationContext,
  'ContentContext': ContentContext,
  'CookieIdContext': CookieIdContext,
  'ExpandableContext': ExpandableContext,
  'HttpContext': HttpContext,
  'IdentityContext': IdentityContext,
  'InputContext': InputContext,
  'InputValueContext': InputValueContext,
  'LinkContext': LinkContext,
  'LocaleContext': LocaleContext,
  'MarketingContext': MarketingContext,
  'MediaPlayerContext': MediaPlayerContext,
  'NavigationContext': NavigationContext,
  'OverlayContext': OverlayContext,
  'PathContext': PathContext,
  'PressableContext': PressableContext,
  'RootLocationContext': RootLocationContext,
  'SessionContext': SessionContext,
};

/**
 * The validate method can be used to safely parse an Event.
 * Possible return values:
 * - Valid event: { success: true, data: <parsed event object> }.
 * - Invalid event: { success: false, error: <error collection> }.
 */
const validate = z.union([
  ApplicationLoadedEvent,
  FailureEvent,
  HiddenEvent,
  InputChangeEvent,
  InteractiveEvent,
  MediaEvent,
  MediaLoadEvent,
  MediaPauseEvent,
  MediaStartEvent,
  MediaStopEvent,
  NonInteractiveEvent,
  PressEvent,
  SuccessEvent,
  VisibleEvent,
]).safeParse;

exports.ContextTypes = ContextTypes;
exports.EventTypes = EventTypes;
exports.ApplicationContext = ApplicationContext;
exports.ContentContext = ContentContext;
exports.CookieIdContext = CookieIdContext;
exports.ExpandableContext = ExpandableContext;
exports.HttpContext = HttpContext;
exports.IdentityContext = IdentityContext;
exports.InputContext = InputContext;
exports.InputValueContext = InputValueContext;
exports.LinkContext = LinkContext;
exports.LocaleContext = LocaleContext;
exports.MarketingContext = MarketingContext;
exports.MediaPlayerContext = MediaPlayerContext;
exports.NavigationContext = NavigationContext;
exports.OverlayContext = OverlayContext;
exports.PathContext = PathContext;
exports.RootLocationContext = RootLocationContext;
exports.SessionContext = SessionContext;
exports.PressableContextEntity = PressableContextEntity;
exports.PressableContext = PressableContext;
exports.LocationStack = LocationStack;
exports.GlobalContexts = GlobalContexts;
exports.ApplicationLoadedEvent = ApplicationLoadedEvent;
exports.FailureEvent = FailureEvent;
exports.HiddenEvent = HiddenEvent;
exports.InputChangeEvent = InputChangeEvent;
exports.InteractiveEvent = InteractiveEvent;
exports.MediaEvent = MediaEvent;
exports.MediaLoadEvent = MediaLoadEvent;
exports.MediaPauseEvent = MediaPauseEvent;
exports.MediaStartEvent = MediaStartEvent;
exports.MediaStopEvent = MediaStopEvent;
exports.NonInteractiveEvent = NonInteractiveEvent;
exports.PressEvent = PressEvent;
exports.SuccessEvent = SuccessEvent;
exports.VisibleEvent = VisibleEvent;
exports.entityMap = entityMap;
exports.validate = validate;
