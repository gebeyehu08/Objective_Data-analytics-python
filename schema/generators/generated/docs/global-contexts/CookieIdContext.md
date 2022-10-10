# CookieIdContext

A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) describing information needed to reconstruct a user session.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext --> AbstractGlobalContext --> CookieIdContext;
    class CookieIdContext diagramActive
  `}
  caption="Diagram: CookieIdContext"
  baseColor="blue"
/>

### Requires

None.

### Properties

|               | type          | description                                                                                                 | contains |
|:--------------|:--------------|:------------------------------------------------------------------------------------------------------------|:---------|
| **cookie_id** | string        | Unique identifier from the session cookie.                                                                  |          |
| **id**        | string        | A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness. |          |
| **_type**     | discriminator | A string literal used during serialization. Should always match the Context interface name.                 |          |

:::info setting of properties
The collector will automatically set all the properties and assign a `cookie_id`.
:::
