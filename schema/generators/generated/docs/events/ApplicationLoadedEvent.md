# ApplicationLoadedEvent

A [NonInteractiveEvent](/taxonomy/reference/events/NonInteractiveEvent.md) that is emitted after an application (eg. SPA) or a website has finished loading.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractEvent["AbstractEvent<span class='properties'>location_stack: LocationStack<br />global_contexts: GlobalContexts<br />id: uuid<br />time: integer<br /></span>"] --> NonInteractiveEvent;
      NonInteractiveEvent -->       ApplicationLoadedEvent;
    class ApplicationLoadedEvent diagramActive
  `}
  caption="Diagram: ApplicationLoadedEvent inheritance"
  baseColor="blue"
  links={[
{ name: 'AbstractEvent', to: '/taxonomy/events' }, { name: 'NonInteractiveEvent', to: '/taxonomy/reference/events/NonInteractiveEvent' },   ]}
/>

### Requires

None.

### Inherited Properties

|                      | type                                                       | description                                                                                                                                                                                                                                                                  |
|:---------------------|:-----------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **location\_stack**  | [LocationStack](/taxonomy/reference/types/LocationStack)   | The location stack is an ordered list (stack), that contains a hierarchy of location contexts that deterministically describes where an event took place from global to specific. The whole stack (list) is needed to exactly pinpoint where in the UI the event originated. |
| **global\_contexts** | [GlobalContexts](/taxonomy/reference/types/GlobalContexts) | Global contexts add global / general information about the event. They carry information that is not related to where the Event originated (location), such as device, platform or business data.                                                                            |
| **id**               | uuid                                                       | Unique identifier for a specific instance of an event.                                                                                                                                                                                                                       |
| **time**             | integer                                                    | Timestamp indicating when the event was generated.                                                                                                                                                                                                                           |

:::info setting of properties
The tracker will automatically set all the properties.
:::
