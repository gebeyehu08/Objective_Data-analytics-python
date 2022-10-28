---
slug: /taxonomy/events/
---

# AbstractEvent

Describe interactive and non-interactive [Events](/taxonomy/reference/events/overview.md).

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
            AbstractEvent["AbstractEvent<span class='requires_context_and_properties'><span class='requires_context'>requires:<br />ApplicationContext<br /></span><span class='properties'>location_stack: LocationStack<br />global_contexts: GlobalContexts<br />id: uuid<br />time: integer<br /></span></span>"];
      AbstractEvent --> InteractiveEvent["InteractiveEvent<span class='requires_context'>requires:<br />RootLocationContext<br />PathContext<br />ApplicationContext<br /></span><span class='properties'></span>"];
      AbstractEvent --> NonInteractiveEvent["NonInteractiveEvent<span class='requires_context'>requires:<br />ApplicationContext<br /></span><span class='properties'></span>"];
      InteractiveEvent --> InputChangeEvent["InputChangeEvent<span class='requires_context'>requires:<br />InputContext<br />ApplicationContext<br /></span><span class='properties'></span>"];
      InteractiveEvent --> PressEvent["PressEvent<span class='requires_context'>requires:<br />PressableContext<br />ApplicationContext<br /></span><span class='properties'></span>"];
      NonInteractiveEvent --> ApplicationLoadedEvent["ApplicationLoadedEvent<span class='requires_context'>requires:<br />ApplicationContext<br /></span><span class='properties'></span>"];
      NonInteractiveEvent --> FailureEvent["FailureEvent<span class='requires_context_and_properties'><span class='requires_context'>requires:<br />ApplicationContext<br /></span><span class='properties'>message: string<br /></span></span>"];
      NonInteractiveEvent --> HiddenEvent["HiddenEvent<span class='requires_context'>requires:<br />ApplicationContext<br /></span><span class='properties'></span>"];
      NonInteractiveEvent --> MediaEvent["MediaEvent<span class='requires_context'>requires:<br />MediaPlayerContext<br />ApplicationContext<br /></span><span class='properties'></span>"];
      NonInteractiveEvent --> SuccessEvent["SuccessEvent<span class='requires_context_and_properties'><span class='requires_context'>requires:<br />ApplicationContext<br /></span><span class='properties'>message: string<br /></span></span>"];
      NonInteractiveEvent --> VisibleEvent["VisibleEvent<span class='requires_context'>requires:<br />ApplicationContext<br /></span><span class='properties'></span>"];
      MediaEvent --> MediaLoadEvent["MediaLoadEvent<span class='requires_context'>requires:<br />ApplicationContext<br /></span><span class='properties'></span>"];
      MediaEvent --> MediaPauseEvent["MediaPauseEvent<span class='requires_context'>requires:<br />ApplicationContext<br /></span><span class='properties'></span>"];
      MediaEvent --> MediaStartEvent["MediaStartEvent<span class='requires_context'>requires:<br />ApplicationContext<br /></span><span class='properties'></span>"];
      MediaEvent --> MediaStopEvent["MediaStopEvent<span class='requires_context'>requires:<br />ApplicationContext<br /></span><span class='properties'></span>"];
    class AbstractEvent diagramActive
  `}
  caption="Diagram: AbstractEvent inheritance"
  baseColor="blue"
  links={[
{ name: 'InteractiveEvent', to: '/taxonomy/reference/events/InteractiveEvent' }, { name: 'NonInteractiveEvent', to: '/taxonomy/reference/events/NonInteractiveEvent' }, { name: 'InputChangeEvent', to: '/taxonomy/reference/events/InputChangeEvent' }, { name: 'PressEvent', to: '/taxonomy/reference/events/PressEvent' }, { name: 'ApplicationLoadedEvent', to: '/taxonomy/reference/events/ApplicationLoadedEvent' }, { name: 'FailureEvent', to: '/taxonomy/reference/events/FailureEvent' }, { name: 'HiddenEvent', to: '/taxonomy/reference/events/HiddenEvent' }, { name: 'MediaEvent', to: '/taxonomy/reference/events/MediaEvent' }, { name: 'SuccessEvent', to: '/taxonomy/reference/events/SuccessEvent' }, { name: 'VisibleEvent', to: '/taxonomy/reference/events/VisibleEvent' }, { name: 'MediaLoadEvent', to: '/taxonomy/reference/events/MediaLoadEvent' }, { name: 'MediaPauseEvent', to: '/taxonomy/reference/events/MediaPauseEvent' }, { name: 'MediaStartEvent', to: '/taxonomy/reference/events/MediaStartEvent' }, { name: 'MediaStopEvent', to: '/taxonomy/reference/events/MediaStopEvent' },   ]}
/>

### Requires

None.

### Properties

|                      | type           | description                                                                                                                                                                                                                                                                  |
|:---------------------|:---------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **location\_stack**  | LocationStack  | The location stack is an ordered list (stack), that contains a hierarchy of location contexts that deterministically describes where an event took place from global to specific. The whole stack (list) is needed to exactly pinpoint where in the UI the event originated. |
| **global\_contexts** | GlobalContexts | Global contexts add global / general information about the event. They carry information that is not related to where the Event originated (location), such as device, platform or business data.                                                                            |
| **id**               | uuid           | Unique identifier for a specific instance of an event.                                                                                                                                                                                                                       |
| **time**             | integer        | Timestamp indicating when the event was generated.                                                                                                                                                                                                                           |

### Validation Rules
* GlobalContexts items must be unique by their _type+id, except for InputValueContext.
* GlobalContexts must contain context ApplicationContext.
* InputValueContext must be unique by their _type+id+value.
* LocationStack items must be unique by their _type+id.


