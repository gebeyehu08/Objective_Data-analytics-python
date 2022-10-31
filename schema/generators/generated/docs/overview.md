---
slug: /taxonomy/reference/
---

# Open analytics taxonomy reference

## Global Contexts
[Global Contexts](/taxonomy/reference/global-contexts/overview.md) capture general data about the state in which an [Event](/taxonomy/reference/events/overview.md) happened, such as a user's [identity](/taxonomy/reference/global-contexts/IdentityContext.md) & [marketing information](/taxonomy/reference/global-contexts/MarketingContext.md).

* [ApplicationContext](./global-contexts/ApplicationContext.md)
* [CookieIdContext](./global-contexts/CookieIdContext.md)
* [HttpContext](./global-contexts/HttpContext.md)
* [IdentityContext](./global-contexts/IdentityContext.md)
* [InputValueContext](./global-contexts/InputValueContext.md)
* [LocaleContext](./global-contexts/LocaleContext.md)
* [MarketingContext](./global-contexts/MarketingContext.md)
* [PathContext](./global-contexts/PathContext.md)
* [SessionContext](./global-contexts/SessionContext.md)

## Location Contexts
[Location Contexts](/taxonomy/reference/location-contexts/overview.md) describe the exact position in an application's UI from where an Event was triggered. A location stack is composed of a hierarchical stack of LocationContexts; the order defines the hierarchy.

* [ContentContext](./location-contexts/ContentContext.md)
* [ExpandableContext](./location-contexts/ExpandableContext.md)
* [InputContext](./location-contexts/InputContext.md)
* [MediaPlayerContext](./location-contexts/MediaPlayerContext.md)
* [NavigationContext](./location-contexts/NavigationContext.md)
* [OverlayContext](./location-contexts/OverlayContext.md)
* [PressableContext](./location-contexts/PressableContext.md)
* [RootLocationContext](./location-contexts/RootLocationContext.md)
* [LinkContext](./location-contexts/LinkContext.md)

## Events
Describe interactive and non-interactive [Events](/taxonomy/reference/events/overview.md).

* [InteractiveEvent](./events/InteractiveEvent.md)
* [NonInteractiveEvent](./events/NonInteractiveEvent.md)
* [InputChangeEvent](./events/InputChangeEvent.md)
* [PressEvent](./events/PressEvent.md)
* [ApplicationLoadedEvent](./events/ApplicationLoadedEvent.md)
* [FailureEvent](./events/FailureEvent.md)
* [HiddenEvent](./events/HiddenEvent.md)
* [MediaEvent](./events/MediaEvent.md)
* [SuccessEvent](./events/SuccessEvent.md)
* [VisibleEvent](./events/VisibleEvent.md)
* [MediaLoadEvent](./events/MediaLoadEvent.md)
* [MediaPauseEvent](./events/MediaPauseEvent.md)
* [MediaStartEvent](./events/MediaStartEvent.md)
* [MediaStopEvent](./events/MediaStopEvent.md)

## Types
Describe the possible contents of properties that Events and Contexts can have.
* [LocationStack](/taxonomy/reference/types/LocationStack.md)
* [GlobalContexts](/taxonomy/reference/types/GlobalContexts.md)
