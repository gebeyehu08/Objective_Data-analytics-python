# ExpandableContext

A [LocationContext](/taxonomy/reference/location-contexts/overview.md)  that describes a section of the UI that can expand & collapse.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext --> AbstractLocationContext --> ExpandableContext;
    class ExpandableContext diagramActive
  `}
  caption="Diagram: ExpandableContext"
  baseColor="blue"
/>

### Requires

None.

### Properties

|           | type          | description                                                                                                 | contains |
|:----------|:--------------|:------------------------------------------------------------------------------------------------------------|:---------|
| **id**    | string        | A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness. |          |
| **_type** | discriminator | A string literal used during serialization. Should always match the Context interface name.                 |          |

:::info setting of the id & type
The tracker will automatically set the id and _type based on the expandable element. When this is not possible on a specific platform, it will ask for a manual id and _type to be set.
:::
