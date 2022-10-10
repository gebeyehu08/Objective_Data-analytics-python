# SessionContext

A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) describing meta information about the current session.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext --> AbstractGlobalContext --> SessionContext;
    class SessionContext diagramActive
  `}
  caption="Diagram: SessionContext"
  baseColor="blue"
/>

### Requires

None.

### Properties

|                | type          | description                                                                                                 | contains |
|:---------------|:--------------|:------------------------------------------------------------------------------------------------------------|:---------|
| **hit_number** | integer       | Hit counter relative to the current session, this event originated in.                                      |          |
| **id**         | string        | A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness. |          |
| **_type**      | discriminator | A string literal used during serialization. Should always match the Context interface name.                 |          |

:::info setting of properties
The tracker will automatically set all the properties and assign a `hit_number`.
:::
