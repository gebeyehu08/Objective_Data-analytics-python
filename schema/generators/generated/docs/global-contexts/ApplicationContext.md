# ApplicationContext

A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) describing in which app the event happens, like a website or iOS app.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext["AbstractContext<span class='properties'>id: string<br /></span>"] --> AbstractGlobalContext;
      AbstractGlobalContext -->       ApplicationContext;
    class ApplicationContext diagramActive
  `}
  caption="Diagram: ApplicationContext inheritance"
  baseColor="blue"
  links={[
{ name: 'AbstractGlobalContext', to: '/taxonomy/global-contexts' },   ]}
/>

### Inherited Properties

|        | type   | description                                                                                                |
|:-------|:-------|:-----------------------------------------------------------------------------------------------------------|
| **id** | string | A unique string identifier to be combined with the Context Type (`_type`) for Context instance uniqueness. |

:::info setting of properties
The tracker will automatically set all properties and factor this context. On manual creation, `id` must be provided.
:::
