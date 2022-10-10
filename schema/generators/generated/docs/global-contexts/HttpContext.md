# HttpContext

A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) describing meta information about the agent that sent the event.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext --> AbstractGlobalContext --> HttpContext;
    class HttpContext diagramActive
  `}
  caption="Diagram: HttpContext"
  baseColor="blue"
/>

### Requires

None.

### Properties

|                    | type          | description                                                                                                 | contains |
|:-------------------|:--------------|:------------------------------------------------------------------------------------------------------------|:---------|
| **referrer**       | string        | Full URL to HTTP referrer of the current page.                                                              |          |
| **user_agent**     | string        | User-agent of the agent that sent the event.                                                                |          |
| **remote_address** | string        | (public) IP address of the agent that sent the event.                                                       |          |
| **id**             | string        | A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness. |          |
| **_type**          | discriminator | A string literal used during serialization. Should always match the Context interface name.                 |          |

:::info setting of properties
The tracker will automatically set the `_type`, `referrer` and `user_agent` properties, while the collector will automatically set the `remote_address`.
:::
