# AbstractEvent



import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
            AbstractEvent["AbstractEvent<span class='properties'>schema_version: string<br />location_stack: LocationStack<br />global_contexts: GlobalContexts<br />_type: discriminator<br />id: uuid<br />time: integer<br /></span>"];
      AbstractEvent --> ApplicationLoadedEvent;
      AbstractEvent --> FailureEvent;
      AbstractEvent --> HiddenEvent;
      AbstractEvent --> InputChangeEvent;
      AbstractEvent --> InteractiveEvent;
      AbstractEvent --> MediaEvent;
      AbstractEvent --> MediaLoadEvent;
      AbstractEvent --> MediaPauseEvent;
      AbstractEvent --> MediaStartEvent;
      AbstractEvent --> MediaStopEvent;
      AbstractEvent --> NonInteractiveEvent;
      AbstractEvent --> PressEvent;
      AbstractEvent --> SuccessEvent;
      AbstractEvent --> VisibleEvent;
    class AbstractEvent diagramActive
  `}
  caption="Diagram: AbstractEvent"
  baseColor="blue"
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


