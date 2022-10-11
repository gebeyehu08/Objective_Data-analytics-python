# MediaPauseEvent

A [MediaEvent](/taxonomy/reference/events/MediaEvent) that's emitted after a media item pauses playback.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractEvent["AbstractEvent<span class='properties'>schema_version: string<br />location_stack: LocationStack<br />global_contexts: GlobalContexts<br />_type: discriminator<br />id: uuid<br />time: integer<br /></span>"] --> NonInteractiveEvent["NonInteractiveEvent<span class='properties'>schema_version: string<br />location_stack: LocationStack<br />global_contexts: GlobalContexts<br />_type: discriminator<br />id: uuid<br />time: integer<br /></span>"];
MediaEvent["MediaEvent<span class='requires_context'>requires:<br />MediaPlayerContext<br /></span><span class='properties'></span>"] -->       MediaEvent --> MediaPauseEvent;
    class MediaPauseEvent diagramActive
  `}
  caption="Diagram: MediaPauseEvent"
  baseColor="blue"
  links={[
    { name: 'AbstractEvent', to: '/taxonomy/reference/abstracts/AbstractEvent' },
    { name: 'NonInteractiveEvent', to: '/taxonomy/reference/events/NonInteractiveEvent' },
    { name: 'MediaEvent', to: '/taxonomy/reference/events/MediaEvent' },
  ]}
/>

### Requires

None.

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
