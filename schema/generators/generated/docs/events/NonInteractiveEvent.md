# NonInteractiveEvent

The parent of [Events](/taxonomy/events) that are not directly triggered by a user action.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractEvent["AbstractEvent<span class='properties'>location_stack: LocationStack<br />global_contexts: GlobalContexts<br />id: uuid<br />time: integer<br /></span>"] -->       NonInteractiveEvent;
      NonInteractiveEvent --> ApplicationLoadedEvent;
      NonInteractiveEvent --> FailureEvent["FailureEvent<span class='properties'>message: string<br /></span>"];
      NonInteractiveEvent --> HiddenEvent;
      NonInteractiveEvent --> MediaEvent["MediaEvent<span class='requires_context'>requires:<br />MediaPlayerContext<br /></span><span class='properties'></span>"];
      NonInteractiveEvent --> SuccessEvent["SuccessEvent<span class='properties'>message: string<br /></span>"];
      NonInteractiveEvent --> VisibleEvent;
      MediaEvent --> MediaLoadEvent;
      MediaEvent --> MediaPauseEvent;
      MediaEvent --> MediaStartEvent;
      MediaEvent --> MediaStopEvent;
    class NonInteractiveEvent diagramActive
  `}
  caption="Diagram: NonInteractiveEvent inheritance"
  baseColor="blue"
  links={[
{ name: 'AbstractEvent', to: '/taxonomy/events' }, { name: 'ApplicationLoadedEvent', to: '/taxonomy/reference/events/ApplicationLoadedEvent' }, { name: 'FailureEvent', to: '/taxonomy/reference/events/FailureEvent' }, { name: 'HiddenEvent', to: '/taxonomy/reference/events/HiddenEvent' }, { name: 'MediaEvent', to: '/taxonomy/reference/events/MediaEvent' }, { name: 'SuccessEvent', to: '/taxonomy/reference/events/SuccessEvent' }, { name: 'VisibleEvent', to: '/taxonomy/reference/events/VisibleEvent' }, { name: 'MediaLoadEvent', to: '/taxonomy/reference/events/MediaLoadEvent' }, { name: 'MediaPauseEvent', to: '/taxonomy/reference/events/MediaPauseEvent' }, { name: 'MediaStartEvent', to: '/taxonomy/reference/events/MediaStartEvent' }, { name: 'MediaStopEvent', to: '/taxonomy/reference/events/MediaStopEvent' },   ]}
/>

### Requires

None.

### Inherited Properties

|                      | type           | description                                                                                                                                                                                                                                                                  |
|:---------------------|:---------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **location\_stack**  | LocationStack  | The location stack is an ordered list (stack), that contains a hierarchy of location contexts that deterministically describes where an event took place from global to specific. The whole stack (list) is needed to exactly pinpoint where in the UI the event originated. |
| **global\_contexts** | GlobalContexts | Global contexts add global / general information about the event. They carry information that is not related to where the Event originated (location), such as device, platform or business data.                                                                            |
| **id**               | uuid           | Unique identifier for a specific instance of an event.                                                                                                                                                                                                                       |
| **time**             | integer        | Timestamp indicating when the event was generated.                                                                                                                                                                                                                           |


