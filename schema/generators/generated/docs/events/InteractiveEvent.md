# InteractiveEvent

The parent of [Events](/taxonomy/events) that are the direct result of a user interaction, e.g. a button click.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractEvent["AbstractEvent<span class='requires_context_and_properties'><span class='requires_context'>requires:<br />ApplicationContext<br /></span><span class='properties'>location_stack: LocationStack<br />global_contexts: GlobalContexts<br />id: uuid<br />time: integer<br /></span></span>"] -->       InteractiveEvent["InteractiveEvent<span class='requires_context'>requires:<br />RootLocationContext<br />PathContext<br /></span><span class='properties'></span>"];
      InteractiveEvent --> InputChangeEvent["InputChangeEvent<span class='requires_context'>requires:<br />InputContext<br /></span><span class='properties'></span>"];
      InteractiveEvent --> PressEvent["PressEvent<span class='requires_context'>requires:<br />PressableContext<br /></span><span class='properties'></span>"];
    class InteractiveEvent diagramActive
  `}
  caption="Diagram: InteractiveEvent inheritance"
  baseColor="blue"
  links={[
{ name: 'AbstractEvent', to: '/taxonomy/events' }, { name: 'InputChangeEvent', to: '/taxonomy/reference/events/InputChangeEvent' }, { name: 'PressEvent', to: '/taxonomy/reference/events/PressEvent' },   ]}
/>

### Requires

* [RootLocationContext](../location-contexts/RootLocationContext.md) (a LocationContext).
* [PathContext](../global-contexts/PathContext.md) (a GlobalContext).

### Inherited Properties

|                      | type                                                       | description                                                                                                                                                                                                                                                                    |
|:---------------------|:-----------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **location\_stack**  | [LocationStack](/taxonomy/reference/types/LocationStack)   | The LocationStack is an ordered list (a stack) containing a hierarchy of LocationContexts, which deterministically describes where in the UI of an application an Event took place.                                                                                            |
| **global\_contexts** | [GlobalContexts](/taxonomy/reference/types/GlobalContexts) | GlobalContexts add global/general information about the state in which an Event happened, such as a user's identity and marketing information. They do not carry information related to where the Event originated (location), which instead is captured by the LocationStack. |
| **id**               | uuid                                                       | Unique identifier for a specific instance of an event.                                                                                                                                                                                                                         |
| **time**             | integer                                                    | Timestamp indicating when the event was generated.                                                                                                                                                                                                                             |

### Validation Rules
* [GlobalContexts](/taxonomy/reference/types/GlobalContexts) should contain one [PathContext](/taxonomy/reference/global-contexts/PathContext.md).
* [LocationStack](/taxonomy/reference/types/LocationStack) should contain [RootLocationContext](/taxonomy/reference/location-contexts/RootLocationContext.md) at index 0.


