# PressEvent

An [InteractiveEvent](/taxonomy/reference/events/InteractiveEvent.md) that is sent when a user presses on a pressable element (like a link, button, icon). Optionally, add an [InputValueContext](/taxonomy/reference/global-contexts/InputValueContext.md) to track the input value(s) from the user.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractEvent["AbstractEvent<span class='requires_context_and_properties'><span class='requires_context'>requires:<br />ApplicationContext<br /></span><span class='properties'>location_stack: LocationStack<br />global_contexts: GlobalContexts<br />id: uuid<br />time: integer<br /></span></span>"] --> InteractiveEvent["InteractiveEvent<span class='requires_context'>requires:<br />RootLocationContext<br />PathContext<br /></span><span class='properties'></span>"];
      InteractiveEvent["InteractiveEvent<span class='requires_context'>requires:<br />RootLocationContext<br />PathContext<br /></span><span class='properties'></span>"] -->       PressEvent["PressEvent<span class='requires_context'>requires:<br />PressableContext<br /></span><span class='properties'></span>"];
    class PressEvent diagramActive
  `}
  caption="Diagram: PressEvent inheritance"
  baseColor="blue"
  links={[
{ name: 'AbstractEvent', to: '/taxonomy/events' }, { name: 'InteractiveEvent', to: '/taxonomy/reference/events/InteractiveEvent' },   ]}
/>

### Requires

* [PressableContext](../location-contexts/PressableContext.md) (a LocationContext).

### Inherited Properties

|                      | type                                                       | description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|:---------------------|:-----------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **location\_stack**  | [LocationStack](/taxonomy/reference/types/LocationStack)   | The LocationStack is an ordered list (a stack) containing a hierarchy of [LocationContexts](/taxonomy/reference/location-contexts/overview.md), which deterministically describes where in the UI of an application an [Event](/taxonomy/reference/events/overview.md) took place.                                                                                                                                                                                                                                                    |
| **global\_contexts** | [GlobalContexts](/taxonomy/reference/types/GlobalContexts) | GlobalContexts add global/general information about the state in which an [Event](/taxonomy/reference/events/overview.md) happened, such as a user's [identity](/taxonomy/reference/global-contexts/IdentityContext.md) and [marketing information](/taxonomy/reference/global-contexts/MarketingContext.md). They do not carry information related to where the [Event](/taxonomy/reference/events/overview.md) originated (location), which instead is captured by the [LocationStack](/taxonomy/reference/types/LocationStack.md). |
| **id**               | uuid                                                       | Unique identifier for a specific instance of an event.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **time**             | integer                                                    | Timestamp indicating when the event was generated.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

### Validation Rules
* [LocationStack](/taxonomy/reference/types/LocationStack) should contain [PressableContext](/taxonomy/reference/location-contexts/PressableContext.md).

:::info setting of properties
The tracker will automatically set all the properties.
:::
