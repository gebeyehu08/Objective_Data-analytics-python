# InputChangeEvent

An [InteractiveEvent](/taxonomy/reference/events/InteractiveEvent.md) that's triggered when user input is modified. Optionally, add an [InputValueContext](../global-contexts/InputValueContext.md) to track the input value from the user.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractEvent["AbstractEvent<span class='properties'>schema_version: string<br />location_stack: LocationStack<br />global_contexts: GlobalContexts<br />_type: discriminator<br />id: uuid<br />time: integer<br /></span>"] --> InteractiveEvent["InteractiveEvent<span class='requires_context_and_properties'><span class='requires_context'>requires:<br />RootLocationContext<br />PathContext<br /></span><span class='properties'>location_stack: LocationStack<br />schema_version: string<br />global_contexts: GlobalContexts<br />_type: discriminator<br />id: uuid<br />time: integer<br /></span></span"];
      InteractiveEvent --> InputChangeEvent["InputChangeEvent<span class='requires_context'>requires:<br />InputContext<br /></span><span class='properties'></span>"];
    class InputChangeEvent diagramActive
  `}
  caption="Diagram: InputChangeEvent"
  baseColor="blue"
  links={[
    { name: 'InteractiveEvent', to: '/taxonomy/reference/events/InteractiveEvent' }
  ]}
/>

### Requires

* [InputContext](../location-contexts/InputContext.md).

### Properties

|                     | type           | description                                                                               | contains |
|:--------------------|:---------------|:------------------------------------------------------------------------------------------|:---------|
| **location_stack**  | LocationStack  |                                                                                           |          |
| **schema_version**  | string         | The version of the Objectiv Taxonomy Schema used to generate this event.                  |          |
| **global_contexts** | GlobalContexts |                                                                                           |          |
| **_type**           | discriminator  | A string literal used during serialization. Should always match the Event interface name. |          |
| **id**              | uuid           | Unique identifier for a specific instance of an event.                                    |          |
| **time**            | integer        | Timestamp indicating when the event was generated.                                        |          |

:::info setting of properties
The tracker will automatically set all the properties.
:::
