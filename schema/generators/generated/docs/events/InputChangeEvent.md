# InputChangeEvent

An [InteractiveEvent](/taxonomy/reference/events/InteractiveEvent.md) that's triggered when user input is modified. Optionally, add an [InputValueContext](/taxonomy/reference/global-contexts/InputValueContext.md) to track the input value from the user.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractEvent["AbstractEvent<span class='requires_context_and_properties'><span class='requires_context'>requires:<br />ApplicationContext<br /></span><span class='properties'>location_stack: LocationStack<br />global_contexts: GlobalContexts<br />id: uuid<br />time: integer<br /></span></span>"] --> InteractiveEvent["InteractiveEvent<span class='requires_context'>requires:<br />RootLocationContext<br />PathContext<br /></span><span class='properties'></span>"];
      InteractiveEvent["InteractiveEvent<span class='requires_context'>requires:<br />RootLocationContext<br />PathContext<br /></span><span class='properties'></span>"] -->       InputChangeEvent["InputChangeEvent<span class='requires_context'>requires:<br />InputContext<br /></span><span class='properties'></span>"];
    class InputChangeEvent diagramActive
  `}
  caption="Diagram: InputChangeEvent inheritance"
  baseColor="blue"
  links={[
{ name: 'AbstractEvent', to: '/taxonomy/events' }, { name: 'InteractiveEvent', to: '/taxonomy/reference/events/InteractiveEvent' },   ]}
/>

### Requires

* [InputContext](../location-contexts/InputContext.md) (a LocationContext).

### Inherited Properties

|                      | type                                                       | description                                                                                                                                                                                                                                                                  |
|:---------------------|:-----------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **location\_stack**  | [LocationStack](/taxonomy/reference/types/LocationStack)   | The location stack is an ordered list (stack), that contains a hierarchy of location contexts that deterministically describes where an event took place from global to specific. The whole stack (list) is needed to exactly pinpoint where in the UI the event originated. |
| **global\_contexts** | [GlobalContexts](/taxonomy/reference/types/GlobalContexts) | Global contexts add global / general information about the event. They carry information that is not related to where the Event originated (location), such as device, platform or business data.                                                                            |
| **id**               | uuid                                                       | Unique identifier for a specific instance of an event.                                                                                                                                                                                                                       |
| **time**             | integer                                                    | Timestamp indicating when the event was generated.                                                                                                                                                                                                                           |

### Validation Rules
* `GlobalContexts` should contain `ApplicationContext`.
* `InputContext.id` should equal `InputValueContext.id`.
* `LocationStacks` should contain `InputContext`.
* InputValueContext should have a unique combination of `{_type, id, value}` properties.
* Items in `GlobalContexts` should have a unique combination of `{_type, id}` properties, except for `InputValueContext`.
* Items in `LocationStack` should have a unique combination of `{_type, id}` properties.

:::info setting of properties
The tracker will automatically set all the properties.
:::
