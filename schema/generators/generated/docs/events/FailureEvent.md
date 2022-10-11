# FailureEvent

A [NonInteractiveEvent](/taxonomy/reference/events/NonInteractiveEvent.md) that is sent when a user action results in a error, like an invalid email when sending a form.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractEvent["AbstractEvent<span class='properties'>schema_version: string<br />location_stack: LocationStack<br />global_contexts: GlobalContexts<br />_type: discriminator<br />id: uuid<br />time: integer<br /></span>"] --> NonInteractiveEvent;
      NonInteractiveEvent --> FailureEvent["FailureEvent<span class='properties'>message: string<br /></span>"];
    class FailureEvent diagramActive
  `}
  caption="Diagram: FailureEvent"
  baseColor="blue"
  links={[
    { name: 'NonInteractiveEvent', to: '/taxonomy/reference/events/NonInteractiveEvent' }
  ]}
/>

### Requires

None.

### Properties

|                     | type           | description                                                                               | contains |
|:--------------------|:---------------|:------------------------------------------------------------------------------------------|:---------|
| **message**         | string         | Failure message.                                                                          |          |
| **schema_version**  | string         | The version of the Objectiv Taxonomy Schema used to generate this event.                  |          |
| **location_stack**  | LocationStack  |                                                                                           |          |
| **global_contexts** | GlobalContexts |                                                                                           |          |
| **_type**           | discriminator  | A string literal used during serialization. Should always match the Event interface name. |          |
| **id**              | uuid           | Unique identifier for a specific instance of an event.                                    |          |
| **time**            | integer        | Timestamp indicating when the event was generated.                                        |          |

:::info setting of properties
The tracker will automatically set all the properties. The message is an error code or short message captured from the occurring error. This is purely for descriptive purposes.
:::
