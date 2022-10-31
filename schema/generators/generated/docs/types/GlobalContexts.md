# GlobalContexts
GlobalContexts add global/general information about the state in which an [Event](/taxonomy/reference/events/overview.md) happened, such as a user's [identity](/taxonomy/reference/global-contexts/IdentityContext.md) and [marketing information](/taxonomy/reference/global-contexts/MarketingContext.md). They do not carry information related to where the [Event](/taxonomy/reference/events/overview.md) originated (location), which instead is captured by the [LocationStack](/taxonomy/reference/types/LocationStack.md).

## Contains

array<[AbstractGlobalContext](/taxonomy/reference/global-contexts/overview.md)>.

## Validation Rules
GlobalContexts require an `ApplicationContext`, and its items are uniquely identified by a set of `{_type, id}` properties.

Specifically:
* [GlobalContexts](/taxonomy/reference/types/GlobalContexts) should contain one [ApplicationContext](/taxonomy/reference/global-contexts/ApplicationContext.md).
* Items should have a unique combination of `{_type, id}` properties, except for `InputValueContext`.

