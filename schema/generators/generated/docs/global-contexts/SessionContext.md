# SessionContext

A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) describing meta information about the current session.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext["AbstractContext<span class='properties'>_types: array<br />id: string<br />_type: discriminator<br /></span>"] --> AbstractGlobalContext;
      AbstractGlobalContext -->       SessionContext["SessionContext<span class='properties'>hit_number: integer<br /></span>"];
    class SessionContext diagramActive
  `}
  caption="Diagram: SessionContext inheritance"
  baseColor="blue"
  links={[
{ name: 'AbstractContext', to: '/taxonomy/reference/abstracts/AbstractContext' }, { name: 'AbstractGlobalContext', to: '/taxonomy/reference/abstracts/AbstractGlobalContext' },   ]}
/>

### Properties

|                 | type    | description                                                            | contains |
|:----------------|:--------|:-----------------------------------------------------------------------|:---------|
| **hit\_number** | integer | Hit counter relative to the current session, this event originated in. |          |
### Inherited Properties

|             | type          | description                                                                                                | contains                         |
|:------------|:--------------|:-----------------------------------------------------------------------------------------------------------|:---------------------------------|
| **\_types** | array         | An ordered list of the parents of this Context, itself included as the last element.                       | string                           |
| **id**      | string        | A unique string identifier to be combined with the Context Type (`_type`) for Context instance uniqueness. |                                  |
| **\_type**  | discriminator | A string literal used during serialization. Hardcoded to the Context name.                                 | ContextTypes.enum.SessionContext |

:::info setting of properties
The tracker will automatically set all the properties and assign a `hit_number`.
:::
