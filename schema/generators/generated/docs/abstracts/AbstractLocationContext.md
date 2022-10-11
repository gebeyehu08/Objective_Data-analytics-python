# AbstractLocationContext



import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext["AbstractContext<span class='properties'>id: string<br />_type: discriminator<br /></span>"] -->       AbstractLocationContext;
      AbstractLocationContext --> ContentContext;
      AbstractLocationContext --> ExpandableContext;
      AbstractLocationContext --> InputContext;
      AbstractLocationContext --> LinkContext;
      AbstractLocationContext --> MediaPlayerContext;
      AbstractLocationContext --> NavigationContext;
      AbstractLocationContext --> OverlayContext;
      AbstractLocationContext --> PressableContext;
      AbstractLocationContext --> RootLocationContext;
    class AbstractLocationContext diagramActive
  `}
  caption="Diagram: AbstractLocationContext"
  baseColor="blue"
  links={[
    { name: 'AbstractContext', to: '/taxonomy/reference/abstracts/AbstractContext' },
  ]}
/>

### Requires

None.

### Properties

|           | type          | description                                                                                                 | contains |
|:----------|:--------------|:------------------------------------------------------------------------------------------------------------|:---------|
| **id**    | string        | A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness. |          |
| **_type** | discriminator | A string literal used during serialization. Should always match the Context interface name.                 |          |


