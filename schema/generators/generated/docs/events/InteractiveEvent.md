# InteractiveEvent

The parent of [Events](/taxonomy/events) that are the direct result of a user interaction, e.g. a button click.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractEvent["AbstractEvent<span class='properties'>location_stack: LocationStack<br />global_contexts: GlobalContexts<br />id: uuid<br />time: integer<br /></span>"] -->       InteractiveEvent["InteractiveEvent<span class='requires_context'>requires:<br />RootLocationContext<br />PathContext<br /></span><span class='properties'></span>"];
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

|                      | type           | description                                                                                                                                                                                                                                                                  |
|:---------------------|:---------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **location\_stack**  | LocationStack  | The location stack is an ordered list (stack), that contains a hierarchy of location contexts that deterministically describes where an event took place from global to specific. The whole stack (list) is needed to exactly pinpoint where in the UI the event originated. |
| **global\_contexts** | GlobalContexts | Global contexts add global / general information about the event. They carry information that is not related to where the Event originated (location), such as device, platform or business data.                                                                            |
| **id**               | uuid           | Unique identifier for a specific instance of an event.                                                                                                                                                                                                                       |
| **time**             | integer        | Timestamp indicating when the event was generated.                                                                                                                                                                                                                           |


