# HttpContext

A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) describing meta information about the agent that sent the event.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext["AbstractContext<span class='properties'>id: string<br /></span>"] --> AbstractGlobalContext;
      AbstractGlobalContext -->       HttpContext["HttpContext<span class='properties'>referrer: string<br />user_agent: string<br />remote_address?: string<br /></span>"];
    class HttpContext diagramActive
  `}
  caption="Diagram: HttpContext inheritance"
  baseColor="blue"
  links={[
{ name: 'AbstractGlobalContext', to: '/taxonomy/global-contexts' },   ]}
/>

### Properties

|                                  | type   | description                                           |
|:---------------------------------|:-------|:------------------------------------------------------|
| **referrer**                     | string | Full URL to HTTP referrer of the current page.        |
| **user\_agent**                  | string | User-agent of the agent that sent the event.          |
| **remote\_address _[optional]_** | string | (public) IP address of the agent that sent the event. |
### Inherited Properties

|        | type   | description                                                                                                |
|:-------|:-------|:-----------------------------------------------------------------------------------------------------------|
| **id** | string | A unique string identifier to be combined with the Context Type (`_type`) for Context instance uniqueness. |

:::info setting of properties
The tracker will automatically set the `_type`, `referrer` and `user_agent` properties, while the collector will automatically set the `remote_address`.
:::
