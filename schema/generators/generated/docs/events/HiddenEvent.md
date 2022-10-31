# HiddenEvent

A [NonInteractiveEvent](/taxonomy/reference/events/NonInteractiveEvent.md) that's emitted after a [LocationContext](/taxonomy/reference/location-contexts/overview.md) has become invisible.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractEvent["AbstractEvent<span class='requires_context_and_properties'><span class='requires_context'>requires:<br />ApplicationContext<br /></span><span class='properties'>location_stack: LocationStack<br />global_contexts: GlobalContexts<br />id: uuid<br />time: integer<br /></span></span>"] --> NonInteractiveEvent;
      NonInteractiveEvent -->       HiddenEvent;
    class HiddenEvent diagramActive
  `}
  caption="Diagram: HiddenEvent inheritance"
  baseColor="blue"
  links={[
{ name: 'AbstractEvent', to: '/taxonomy/events' }, { name: 'NonInteractiveEvent', to: '/taxonomy/reference/events/NonInteractiveEvent' },   ]}
/>

### Requires

None.

### Inherited Properties

|                      | type                                                       | description                                                                                                                                                                                                                                                                    |
|:---------------------|:-----------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **location\_stack**  | [LocationStack](/taxonomy/reference/types/LocationStack)   | The LocationStack is an ordered list (a stack) containing a hierarchy of LocationContexts, which deterministically describes where in the UI of an application an Event took place.                                                                                            |
| **global\_contexts** | [GlobalContexts](/taxonomy/reference/types/GlobalContexts) | GlobalContexts add global/general information about the state in which an Event happened, such as a user's identity and marketing information. They do not carry information related to where the Event originated (location), which instead is captured by the LocationStack. |
| **id**               | uuid                                                       | Unique identifier for a specific instance of an event.                                                                                                                                                                                                                         |
| **time**             | integer                                                    | Timestamp indicating when the event was generated.                                                                                                                                                                                                                             |


:::info setting of properties
The tracker will automatically set all the properties.
:::
