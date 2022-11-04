---
slug: /taxonomy/location-contexts/
---

# AbstractLocationContext

[Location Contexts](/taxonomy/reference/location-contexts/overview.md) describe the exact position in an application's UI from where an Event was triggered. A location stack is composed of a hierarchical stack of LocationContexts; the order defines the hierarchy.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext["AbstractContext<span class='properties'>id: string<br /></span>"] -->       AbstractLocationContext;
      AbstractLocationContext --> ContentContext;
      AbstractLocationContext --> ExpandableContext;
      AbstractLocationContext --> InputContext;
      AbstractLocationContext --> MediaPlayerContext;
      AbstractLocationContext --> NavigationContext;
      AbstractLocationContext --> OverlayContext;
      AbstractLocationContext --> PressableContext;
      AbstractLocationContext --> RootLocationContext;
      PressableContext --> LinkContext["LinkContext<span class='properties'>href: string<br /></span>"];
    class AbstractLocationContext diagramActive
  `}
  caption="Diagram: AbstractLocationContext inheritance"
  baseColor="blue"
  links={[
{ name: 'ContentContext', to: '/taxonomy/reference/location-contexts/ContentContext' }, { name: 'ExpandableContext', to: '/taxonomy/reference/location-contexts/ExpandableContext' }, { name: 'InputContext', to: '/taxonomy/reference/location-contexts/InputContext' }, { name: 'MediaPlayerContext', to: '/taxonomy/reference/location-contexts/MediaPlayerContext' }, { name: 'NavigationContext', to: '/taxonomy/reference/location-contexts/NavigationContext' }, { name: 'OverlayContext', to: '/taxonomy/reference/location-contexts/OverlayContext' }, { name: 'PressableContext', to: '/taxonomy/reference/location-contexts/PressableContext' }, { name: 'RootLocationContext', to: '/taxonomy/reference/location-contexts/RootLocationContext' }, { name: 'LinkContext', to: '/taxonomy/reference/location-contexts/LinkContext' },   ]}
/>

### Inherited Properties

|        | type   | description                                                                                                |
|:-------|:-------|:-----------------------------------------------------------------------------------------------------------|
| **id** | string | A unique string identifier to be combined with the Context Type (`_type`) for Context instance uniqueness. |


