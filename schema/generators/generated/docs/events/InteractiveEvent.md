# InteractiveEvent

The parent of [Events](/taxonomy/events) that are the direct result of a user interaction, e.g. a button click.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractEvent["AbstractEvent<span class='properties'>schema_version: string<br />location_stack: LocationStack<br />global_contexts: GlobalContexts<br />_type: discriminator<br />id: uuid<br />time: integer<br /></span>"] -->       AbstractEvent --> InteractiveEvent["InteractiveEvent<span class='requires_context'>requires:<br />RootLocationContext<br />PathContext<br /></span><span class='properties'></span>"];
    class InteractiveEvent diagramActive
  `}
  caption="Diagram: InteractiveEvent"
  baseColor="blue"
/>

### Requires

* [RootLocationContext](../location-contexts/RootLocationContext.md).
* [PathContext](../global-contexts/PathContext.md).

### Properties

|                     | type           | description                                                                               | contains |
|:--------------------|:---------------|:------------------------------------------------------------------------------------------|:---------|
| **location_stack**  | LocationStack  |                                                                                           |          |
| **schema_version**  | string         | The version of the Objectiv Taxonomy Schema used to generate this event.                  |          |
| **global_contexts** | GlobalContexts |                                                                                           |          |
| **_type**           | discriminator  | A string literal used during serialization. Should always match the Event interface name. |          |
| **id**              | uuid           | Unique identifier for a specific instance of an event.                                    |          |
| **time**            | integer        | Timestamp indicating when the event was generated.                                        |          |


