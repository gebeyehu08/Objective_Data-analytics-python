# MediaEvent

The parent of [non-interactive events](/taxonomy/reference/events/NonInteractiveEvent.md) that are triggered by a media player. It requires a [MediaPlayerContext](/taxonomy/reference/location-contexts/MediaPlayerContext) to detail the origin of the event.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractEvent --> NonInteractiveEvent --> MediaEvent["MediaEvent<br /><span class='properties'>requires:<br />MediaPlayerContext</span>"];
    class MediaEvent diagramActive
  `}
  caption="Diagram: MediaEvent"
  baseColor="blue"
/>

### Requires

* [MediaPlayerContext](../location-contexts/MediaPlayerContext.md).

### Properties

|                     | type           | description                                                                               | contains |
|:--------------------|:---------------|:------------------------------------------------------------------------------------------|:---------|
| **schema_version**  | string         | The version of the Objectiv Taxonomy Schema used to generate this event.                  |          |
| **location_stack**  | LocationStack  |                                                                                           |          |
| **global_contexts** | GlobalContexts |                                                                                           |          |
| **_type**           | discriminator  | A string literal used during serialization. Should always match the Event interface name. |          |
| **id**              | uuid           | Unique identifier for a specific instance of an event.                                    |          |
| **time**            | integer        | Timestamp indicating when the event was generated.                                        |          |

:::info setting of properties
The tracker will automatically set all the properties.
:::
