/*
 * Copyright 2022 Objectiv B.V.
 */

import { z } from 'zod';

/**
 * A refinement that checks whether the given context type is present in the subject contexts
 */
export const requiresContext =
  ({ context, position }) =>
  (contexts, ctx) => {
    const contextIndex = contexts.findIndex(({ _type }) => _type === context);

    if (contextIndex < 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${context} is required.` });
    }

    if (contextIndex >= 0 && position !== undefined && position !== contextIndex) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${context} is required at position ${position}.` });
    }
  };

/**
 * A refinement that checks whether the given context type is present only once in the subject contexts
 */
export const uniqueContext =
  ({ contextType, by }) =>
  (allContexts, ctx) => {
    const contexts = contextType ? allContexts.filter((context) => context._type === contextType) : allContexts;
    const seenContexts = [];

    const duplicatedContexts = contexts.filter((context) => {
      if (
        seenContexts.find((seenContext) => {
          let matchCount = 0;
          by.forEach((propertyToMatch) => {
            if (seenContext[propertyToMatch] === context[propertyToMatch]) {
              matchCount++;
            }
          });
          return matchCount === by.length;
        })
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

/**
 * Context's _type discriminator attribute values
 */
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

/**
 * Event's _type discriminator attribute values
 */
export const EventTypes = z.enum([
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
export const ApplicationContext = z.object({
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Should always match the Context interface name.
   */
  _type: z.literal(ContextTypes.enum.ApplicationContext),
});

/**
 * Global context with information needed to reconstruct a user session.
 */
export const CookieIdContext = z.object({
  /**
   * Unique identifier from the session cookie.
   */
  cookie_id: z.string(),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Should always match the Context interface name.
   */
  _type: z.literal(ContextTypes.enum.CookieIdContext),
});

/**
 * A GlobalContext describing meta information about the agent that sent the event.
 */
export const HttpContext = z.object({
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
  remote_address: z.string().optional(),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Should always match the Context interface name.
   */
  _type: z.literal(ContextTypes.enum.HttpContext),
});

/**
 * A GlobalContext containing the value of a single input element. Multiple can be present.
 */
export const InputValueContext = z.object({
  /**
   * The value of the input element.
   */
  value: z.string(),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Should always match the Context interface name.
   */
  _type: z.literal(ContextTypes.enum.InputValueContext),
});

/**
 * A GlobalContext describing the users' language (ISO 639-1) and country (ISO 3166-1 alpha-2).
 */
export const LocaleContext = z.object({
  /**
   * Case sensitive ISO 639-1 language code. E.g. en, nl, fr, de, it, etc.
   */
  language_code: z.string().optional(),
  /**
   * Case sensitive ISO 3166-1 alpha-2 country code. E.g. US, NL, FR, DE, IT, etc.
   */
  country_code: z.string().optional(),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Should always match the Context interface name.
   */
  _type: z.literal(ContextTypes.enum.LocaleContext),
});

/**
 * A GlobalContext describing the path where the user is when an event is sent.
 */
export const PathContext = z.object({
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Should always match the Context interface name.
   */
  _type: z.literal(ContextTypes.enum.PathContext),
});

/**
 * A GlobalContext describing meta information about the current session.
 */
export const SessionContext = z.object({
  /**
   * Hit counter relative to the current session, this event originated in.
   */
  hit_number: z.bigint(),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Should always match the Context interface name.
   */
  _type: z.literal(ContextTypes.enum.SessionContext),
});

/**
 * a context that captures marketing channel info, so users can do attribution, campaign
 * effectiveness and other models.
 */
export const MarketingContext = z.object({
  /**
   * Identifies the advertiser, site, publication, etc.
   */
  source: z.string(),
  /**
   * Advertising or marketing medium: cpc, banner, email newsletter, etc.
   */
  medium: z.string(),
  /**
   * Individual campaign name, slogan, promo code, etc.
   */
  campaign: z.string(),
  /**
   * [Optional] Search keywords.
   */
  term: z.string().optional(),
  /**
   * [Optional] Used to differentiate similar content, or links within the same ad.
   */
  content: z.string().optional(),
  /**
   * [Optional] To differentiate similar content, or links within the same ad.
   */
  source_platform: z.string().optional(),
  /**
   * [Optional] Identifies the creative used (e.g., skyscraper, banner, etc).
   */
  creative_format: z.string().optional(),
  /**
   * [Optional] Identifies the marketing tactic used (e.g., onboarding, retention, acquisition etc).
   */
  marketing_tactic: z.string().optional(),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Should always match the Context interface name.
   */
  _type: z.literal(ContextTypes.enum.MarketingContext),
});

/**
 * A Global Context to track the identity of users across sessions, platforms, devices. Multiple can be present.
 * The `id` field is used to specify the scope of identification e.g. backend, md5(email), supplier_cookie, etc.
 * The `value` field should contain the unique identifier within that scope.
 */
export const IdentityContext = z.object({
  /**
   * The unique identifier for this user/group/entity within the scope defined by `id`.
   */
  value: z.string(),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Should always match the Context interface name.
   */
  _type: z.literal(ContextTypes.enum.IdentityContext),
});

/**
 * A Location Context that describes an element that accepts user input, i.e. a form field.
 */
export const InputContext = z.object({
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Should always match the Context interface name.
   */
  _type: z.literal(ContextTypes.enum.InputContext),
});

/**
 * A Location Context that describes an interactive element (like a link, button, icon),
 * that the user can press and will trigger an Interactive Event.
 */
export const PressableContext = z.object({
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Should always match the Context interface name.
   */
  _type: z.literal(ContextTypes.enum.PressableContext),
});

/**
 * A PressableContext that contains a destination (href).
 */
export const LinkContext = z.object({
  /**
   * URL (href) the link points to.
   */
  href: z.string(),
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Should always match the Context interface name.
   */
  _type: z.literal(ContextTypes.enum.LinkContext),
});

/**
 * A Location Context that uniquely represents the top-level UI location of the user.
 */
export const RootLocationContext = z.object({
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Should always match the Context interface name.
   */
  _type: z.literal(ContextTypes.enum.RootLocationContext),
});

/**
 * A Location Context that describes a section of the UI that can expand & collapse.
 */
export const ExpandableContext = z.object({
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Should always match the Context interface name.
   */
  _type: z.literal(ContextTypes.enum.ExpandableContext),
});

/**
 * A Location Context that describes a section of the UI containing a media player.
 */
export const MediaPlayerContext = z.object({
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Should always match the Context interface name.
   */
  _type: z.literal(ContextTypes.enum.MediaPlayerContext),
});

/**
 * A Location Context that describes a section of the UI containing navigational elements, for example a menu.
 */
export const NavigationContext = z.object({
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Should always match the Context interface name.
   */
  _type: z.literal(ContextTypes.enum.NavigationContext),
});

/**
 * A Location Context that describes a section of the UI that represents an overlay, i.e. a Modal.
 */
export const OverlayContext = z.object({
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Should always match the Context interface name.
   */
  _type: z.literal(ContextTypes.enum.OverlayContext),
});

/**
 * A Location Context that describes a logical section of the UI that contains other Location Contexts.
 * Enabling Data Science to analyze this section specifically.
 */
export const ContentContext = z.object({
  /**
   * A unique string identifier to be combined with the Context Type (`_type`)
   * for Context instance uniqueness.
   */
  id: z.string(),
  /**
   * A string literal used during serialization. Should always match the Context interface name.
   */
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
  )
  .superRefine(
    requiresContext({
      context: ContextTypes.enum.RootLocationContext,
      position: 0,
    })
  )
  .superRefine(
    uniqueContext({
      by: ['_type', 'id'],
    })
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
  )
  .superRefine(
    requiresContext({
      context: ContextTypes.enum.ApplicationContext,
    })
  )
  .superRefine(
    uniqueContext({
      by: ['_type', 'id'],
    })
  );

/**
 * The parent of Events that are the direct result of a user interaction, e.g. a button click.
 */
export const InteractiveEvent = z.object({
  /**
   * The location stack is an ordered list (stack), that contains a hierarchy of location contexts that
   * deterministically describes where an event took place from global to specific.
   * The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
   */
  location_stack: LocationStack,
  /**
   * Global contexts add global / general information about the event. They carry information that is not
   * related to where the Event originated (location), such as device, platform or business data.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Should always match the Event interface name.
   */
  _type: z.literal(EventTypes.enum.InteractiveEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.bigint(),
})
  .superRefine(
    requiresContext({
      context: ContextTypes.enum.PathContext,
    })
  );

/**
 * The parent of Events that are not directly triggered by a user action.
 */
export const NonInteractiveEvent = z.object({
  /**
   * The location stack is an ordered list (stack), that contains a hierarchy of location contexts that
   * deterministically describes where an event took place from global to specific.
   * The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
   */
  location_stack: LocationStack.optional(),
  /**
   * Global contexts add global / general information about the event. They carry information that is not
   * related to where the Event originated (location), such as device, platform or business data.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Should always match the Event interface name.
   */
  _type: z.literal(EventTypes.enum.NonInteractiveEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.bigint(),
});

/**
 * A NonInteractive event that is emitted after an application (e.g. SPA) has finished loading.
 */
export const ApplicationLoadedEvent = z.object({
  /**
   * The location stack is an ordered list (stack), that contains a hierarchy of location contexts that
   * deterministically describes where an event took place from global to specific.
   * The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
   */
  location_stack: LocationStack.optional(),
  /**
   * Global contexts add global / general information about the event. They carry information that is not
   * related to where the Event originated (location), such as device, platform or business data.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Should always match the Event interface name.
   */
  _type: z.literal(EventTypes.enum.ApplicationLoadedEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.bigint(),
});

/**
 * A NonInteractiveEvent that is sent when a user action results in an error,
 * like an invalid email when sending a form.
 */
export const FailureEvent = z.object({
  /**
   * Failure message.
   */
  message: z.string(),
  /**
   * The location stack is an ordered list (stack), that contains a hierarchy of location contexts that
   * deterministically describes where an event took place from global to specific.
   * The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
   */
  location_stack: LocationStack.optional(),
  /**
   * Global contexts add global / general information about the event. They carry information that is not
   * related to where the Event originated (location), such as device, platform or business data.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Should always match the Event interface name.
   */
  _type: z.literal(EventTypes.enum.FailureEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.bigint(),
});

/**
 * Event triggered when user input is modified.
 */
export const InputChangeEvent = z.object({
  /**
   * The location stack is an ordered list (stack), that contains a hierarchy of location contexts that
   * deterministically describes where an event took place from global to specific.
   * The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
   */
  location_stack: LocationStack,
  /**
   * Global contexts add global / general information about the event. They carry information that is not
   * related to where the Event originated (location), such as device, platform or business data.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Should always match the Event interface name.
   */
  _type: z.literal(EventTypes.enum.InputChangeEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.bigint(),
})
  .superRefine(
    requiresContext({
      context: ContextTypes.enum.InputContext,
    })
  );

/**
 * An InteractiveEvent that is sent when a user presses on a pressable element
 * (like a link, button, icon).
 */
export const PressEvent = z.object({
  /**
   * The location stack is an ordered list (stack), that contains a hierarchy of location contexts that
   * deterministically describes where an event took place from global to specific.
   * The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
   */
  location_stack: LocationStack,
  /**
   * Global contexts add global / general information about the event. They carry information that is not
   * related to where the Event originated (location), such as device, platform or business data.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Should always match the Event interface name.
   */
  _type: z.literal(EventTypes.enum.PressEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.bigint(),
})
  .superRefine(
    requiresContext({
      context: ContextTypes.enum.PressableContext,
    })
  );

/**
 * A NonInteractiveEvent that's emitted after a LocationContext has become invisible.
 */
export const HiddenEvent = z.object({
  /**
   * The location stack is an ordered list (stack), that contains a hierarchy of location contexts that
   * deterministically describes where an event took place from global to specific.
   * The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
   */
  location_stack: LocationStack.optional(),
  /**
   * Global contexts add global / general information about the event. They carry information that is not
   * related to where the Event originated (location), such as device, platform or business data.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Should always match the Event interface name.
   */
  _type: z.literal(EventTypes.enum.HiddenEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.bigint(),
});

/**
 * A NonInteractiveEvent that's emitted after a section LocationContext has become visible.
 */
export const VisibleEvent = z.object({
  /**
   * The location stack is an ordered list (stack), that contains a hierarchy of location contexts that
   * deterministically describes where an event took place from global to specific.
   * The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
   */
  location_stack: LocationStack.optional(),
  /**
   * Global contexts add global / general information about the event. They carry information that is not
   * related to where the Event originated (location), such as device, platform or business data.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Should always match the Event interface name.
   */
  _type: z.literal(EventTypes.enum.VisibleEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.bigint(),
});

/**
 * A NonInteractiveEvent that is sent when a user action is successfully completed,
 * like sending an email form.
 */
export const SuccessEvent = z.object({
  /**
   * Success message.
   */
  message: z.string(),
  /**
   * The location stack is an ordered list (stack), that contains a hierarchy of location contexts that
   * deterministically describes where an event took place from global to specific.
   * The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
   */
  location_stack: LocationStack.optional(),
  /**
   * Global contexts add global / general information about the event. They carry information that is not
   * related to where the Event originated (location), such as device, platform or business data.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Should always match the Event interface name.
   */
  _type: z.literal(EventTypes.enum.SuccessEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.bigint(),
});

/**
 * The parent of non-interactive events that are triggered by a media player.
 * It requires a MediaPlayerContext to detail the origin of the event.
 */
export const MediaEvent = z.object({
  /**
   * The location stack is an ordered list (stack), that contains a hierarchy of location contexts that
   * deterministically describes where an event took place from global to specific.
   * The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
   */
  location_stack: LocationStack.optional(),
  /**
   * Global contexts add global / general information about the event. They carry information that is not
   * related to where the Event originated (location), such as device, platform or business data.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Should always match the Event interface name.
   */
  _type: z.literal(EventTypes.enum.MediaEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.bigint(),
})
  .superRefine(
    requiresContext({
      context: ContextTypes.enum.MediaPlayerContext,
    })
  );

/**
 * A MediaEvent that's emitted after a media item completes loading.
 */
export const MediaLoadEvent = z.object({
  /**
   * The location stack is an ordered list (stack), that contains a hierarchy of location contexts that
   * deterministically describes where an event took place from global to specific.
   * The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
   */
  location_stack: LocationStack.optional(),
  /**
   * Global contexts add global / general information about the event. They carry information that is not
   * related to where the Event originated (location), such as device, platform or business data.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Should always match the Event interface name.
   */
  _type: z.literal(EventTypes.enum.MediaLoadEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.bigint(),
});

/**
 * A MediaEvent that's emitted after a media item pauses playback.
 */
export const MediaPauseEvent = z.object({
  /**
   * The location stack is an ordered list (stack), that contains a hierarchy of location contexts that
   * deterministically describes where an event took place from global to specific.
   * The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
   */
  location_stack: LocationStack.optional(),
  /**
   * Global contexts add global / general information about the event. They carry information that is not
   * related to where the Event originated (location), such as device, platform or business data.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Should always match the Event interface name.
   */
  _type: z.literal(EventTypes.enum.MediaPauseEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.bigint(),
});

/**
 * A MediaEvent that's emitted after a media item starts playback.
 */
export const MediaStartEvent = z.object({
  /**
   * The location stack is an ordered list (stack), that contains a hierarchy of location contexts that
   * deterministically describes where an event took place from global to specific.
   * The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
   */
  location_stack: LocationStack.optional(),
  /**
   * Global contexts add global / general information about the event. They carry information that is not
   * related to where the Event originated (location), such as device, platform or business data.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Should always match the Event interface name.
   */
  _type: z.literal(EventTypes.enum.MediaStartEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.bigint(),
});

/**
 * A MediaEvent that's emitted after a media item stops playback.
 */
export const MediaStopEvent = z.object({
  /**
   * The location stack is an ordered list (stack), that contains a hierarchy of location contexts that
   * deterministically describes where an event took place from global to specific.
   * The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
   */
  location_stack: LocationStack.optional(),
  /**
   * Global contexts add global / general information about the event. They carry information that is not
   * related to where the Event originated (location), such as device, platform or business data.
   */
  global_contexts: GlobalContexts,
  /**
   * A string literal used during serialization. Should always match the Event interface name.
   */
  _type: z.literal(EventTypes.enum.MediaStopEvent),
  /**
   * Unique identifier for a specific instance of an event.
   */
  id: z.string().uuid(),
  /**
   * Timestamp indicating when the event was generated.
   */
  time: z.bigint(),
});

