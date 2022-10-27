# SessionContext

A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) describing meta information about the current session.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext["AbstractContext<span class='properties'>id: string<br /></span>"] --> AbstractGlobalContext;
      AbstractGlobalContext -->       SessionContext["SessionContext<span class='properties'>hit_number: integer<br /></span>"];
    class SessionContext diagramActive
  `}
  caption="Diagram: SessionContext inheritance"
  baseColor="blue"
  links={[
{ name: 'AbstractGlobalContext', to: '/taxonomy/global-contexts' },   ]}
/>

### Properties

|                 | type    | description                                                            |
|:----------------|:--------|:-----------------------------------------------------------------------|
| **hit\_number** | integer | Hit counter relative to the current session, this event originated in. |
### Inherited Properties

|        | type   | description                                                                                                |
|:-------|:-------|:-----------------------------------------------------------------------------------------------------------|
| **id** | string | A unique string identifier to be combined with the Context Type (`_type`) for Context instance uniqueness. |

:::info setting of properties
The tracker will automatically set all the properties and assign a `hit_number`.
:::
