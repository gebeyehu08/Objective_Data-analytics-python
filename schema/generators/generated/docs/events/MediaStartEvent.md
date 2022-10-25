# MediaStartEvent

A [MediaEvent](/taxonomy/reference/events/MediaEvent) that's emitted after a media item starts playback.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractEvent["AbstractEvent<span class='properties'>_schema_version: string<br />_types: array<br />location_stack: LocationStack<br />global_contexts: GlobalContexts<br />_type: discriminator<br />id: uuid<br />time: integer<br /></span>"] --> NonInteractiveEvent;
      NonInteractiveEvent --> MediaEvent["MediaEvent<span class='requires_context'>requires:<br />MediaPlayerContext<br /></span><span class='properties'></span>"] -->       MediaStartEvent;
    class MediaStartEvent diagramActive
  `}
  caption="Diagram: MediaStartEvent inheritance"
  baseColor="blue"
  links={[
{ name: 'AbstractEvent', to: '/taxonomy/reference/abstracts/AbstractEvent' },{ name: 'NonInteractiveEvent', to: '/taxonomy/reference/events/NonInteractiveEvent' },{ name: 'MediaEvent', to: '/taxonomy/reference/events/MediaEvent' },  ]}
/>

### Requires

None.

### Inherited Properties

|                                    | type           | description                                                                                                                                                                                                                                                                  | contains                        |
|:-----------------------------------|:---------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------------------------|
| **\_schema\_version _[optional]_** | string         | The version of the Objectiv Taxonomy Schema used to generate this event.                                                                                                                                                                                                     |                                 |
| **\_types**                        | array          | An ordered list of the parents of this Event, itself included as the last element.                                                                                                                                                                                           | string                          |
| **location\_stack**                | LocationStack  | The location stack is an ordered list (stack), that contains a hierarchy of location contexts that deterministically describes where an event took place from global to specific. The whole stack (list) is needed to exactly pinpoint where in the UI the event originated. |                                 |
| **global\_contexts**               | GlobalContexts | Global contexts add global / general information about the event. They carry information that is not related to where the Event originated (location), such as device, platform or business data.                                                                            |                                 |
| **\_type**                         | discriminator  | A string literal used during serialization. Hardcoded to the Event name.                                                                                                                                                                                                     | EventTypes.enum.MediaStartEvent |
| **id**                             | uuid           | Unique identifier for a specific instance of an event.                                                                                                                                                                                                                       |                                 |
| **time**                           | integer        | Timestamp indicating when the event was generated.                                                                                                                                                                                                                           |                                 |

:::info setting of properties
The tracker will automatically set all the properties.
:::
