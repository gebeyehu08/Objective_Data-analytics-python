# CookieIdContext

A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) describing information needed to reconstruct a user session.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext["AbstractContext<span class='properties'>_types: array<br />id: string<br />_type: discriminator<br /></span>"] --> AbstractGlobalContext;
      AbstractGlobalContext -->       CookieIdContext["CookieIdContext<span class='properties'>cookie_id: string<br /></span>"];
    class CookieIdContext diagramActive
  `}
  caption="Diagram: CookieIdContext inheritance"
  baseColor="blue"
  links={[
{ name: 'AbstractContext', to: '/taxonomy/reference/abstracts/AbstractContext' },{ name: 'AbstractGlobalContext', to: '/taxonomy/reference/abstracts/AbstractGlobalContext' },  ]}
/>

### Properties

|                | type   | description                                | contains |
|:---------------|:-------|:-------------------------------------------|:---------|
| **cookie\_id** | string | Unique identifier from the session cookie. |          |
### Inherited Properties

|             | type          | description                                                                                                | contains                          |
|:------------|:--------------|:-----------------------------------------------------------------------------------------------------------|:----------------------------------|
| **\_types** | array         | An ordered list of the parents of this Context, itself included as the last element.                       | string                            |
| **id**      | string        | A unique string identifier to be combined with the Context Type (`_type`) for Context instance uniqueness. |                                   |
| **\_type**  | discriminator | A string literal used during serialization. Hardcoded to the Context name.                                 | ContextTypes.enum.CookieIdContext |

:::info setting of properties
The collector will automatically set all the properties and assign a `cookie_id`.
:::
