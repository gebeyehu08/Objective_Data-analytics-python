# PressEvent

An [InteractiveEvent](/taxonomy/reference/events/InteractiveEvent.md) that is sent when a user presses on a pressable element (like a link, button, icon). Optionally, add an [InputValueContext](/taxonomy/reference/global-contexts/InputValueContext.md) to track the input value(s) from the user.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractEvent["AbstractEvent<span class='requires_context_and_properties'><span class='requires_context'>requires:<br />ApplicationContext<br /></span><span class='properties'>location_stack: LocationStack<br />global_contexts: GlobalContexts<br />id: uuid<br />time: integer<br /></span></span>"] --> InteractiveEvent["InteractiveEvent<span class='requires_context'>requires:<br />RootLocationContext<br />PathContext<br />ApplicationContext<br /></span><span class='properties'></span>"];
      InteractiveEvent["InteractiveEvent<span class='requires_context'>requires:<br />RootLocationContext<br />PathContext<br />ApplicationContext<br /></span><span class='properties'></span>"] -->       PressEvent["PressEvent<span class='requires_context'>requires:<br />PressableContext<br />ApplicationContext<br /></span><span class='properties'></span>"];
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

|                      | type           | description                                                                                                                                                                                                                                                                  |
|:---------------------|:---------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **location\_stack**  | LocationStack  | The location stack is an ordered list (stack), that contains a hierarchy of location contexts that deterministically describes where an event took place from global to specific. The whole stack (list) is needed to exactly pinpoint where in the UI the event originated. |
| **global\_contexts** | GlobalContexts | Global contexts add global / general information about the event. They carry information that is not related to where the Event originated (location), such as device, platform or business data.                                                                            |
| **id**               | uuid           | Unique identifier for a specific instance of an event.                                                                                                                                                                                                                       |
| **time**             | integer        | Timestamp indicating when the event was generated.                                                                                                                                                                                                                           |

### Validation Rules
* GlobalContexts items must be unique by their _type+id, except for InputValueContext.
* GlobalContexts must contain context ApplicationContext.
* GlobalContexts must contain context PathContext.
* InputValueContext must be unique by their _type+id+value.
* LocationStack items must be unique by their _type+id.
* LocationStacks must contain PressableContext.
* LocationStacks must contain RootLocationContext at index 0.

:::info setting of properties
The tracker will automatically set all the properties.
:::
