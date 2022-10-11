# PathContext

A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) describing the path where the user is when an event is sent.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext["AbstractContext<span class='properties'>id: string<br />_type: discriminator<br /></span>"] --> AbstractGlobalContext;
      AbstractGlobalContext --> PathContext;
    class PathContext diagramActive
  `}
  caption="Diagram: PathContext"
  baseColor="blue"
  links={[
    { name: 'AbstractContext', to: '/taxonomy/reference/abstracts/AbstractContext' },
    { name: 'AbstractGlobalContext', to: '/taxonomy/reference/abstracts/AbstractGlobalContext' },
  ]}
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
The tracker will automatically set the `id` and `_type` based on path on web (including URL parameters, hashes) and pathname on native. When this is not possible on a specific platform, it will ask for a manual `id` and `_type` to be set.
:::
