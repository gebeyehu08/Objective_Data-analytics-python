# CookieIdContext

A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) describing information needed to reconstruct a user session.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext["AbstractContext<span class='properties'>id: string<br /></span>"] --> AbstractGlobalContext;
      AbstractGlobalContext -->       CookieIdContext["CookieIdContext<span class='properties'>cookie_id: string<br /></span>"];
    class CookieIdContext diagramActive
  `}
  caption="Diagram: CookieIdContext inheritance"
  baseColor="blue"
  links={[
{ name: 'AbstractGlobalContext', to: '/taxonomy/global-contexts' },   ]}
/>

### Properties

|                | type   | description                                |
|:---------------|:-------|:-------------------------------------------|
| **cookie\_id** | string | Unique identifier from the session cookie. |
### Inherited Properties

|        | type   | description                                                                                                |
|:-------|:-------|:-----------------------------------------------------------------------------------------------------------|
| **id** | string | A unique string identifier to be combined with the Context Type (`_type`) for Context instance uniqueness. |

:::info setting of properties
The collector will automatically set all the properties and assign a `cookie_id`.
:::
