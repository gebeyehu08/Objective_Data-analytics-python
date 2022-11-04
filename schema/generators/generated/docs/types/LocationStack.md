# LocationStack
The LocationStack is an ordered list (a stack) containing a hierarchy of [LocationContexts](/taxonomy/reference/location-contexts/overview.md), which deterministically describes where in the UI of an application an [Event](/taxonomy/reference/events/overview.md) took place.

## Contains

array<[AbstractLocationContext](/taxonomy/reference/global-contexts/overview.md)>.

## Validation Rules
LocationStack items are uniquely identified by a set of `{_type, id}` properties.

Specifically:
* Items should have a unique combination of `{_type, id}` properties.

