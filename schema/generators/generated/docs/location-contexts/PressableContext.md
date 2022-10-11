# PressableContext

A [LocationContext](/taxonomy/reference/location-contexts/overview.md) that describes an interactive element (like a link, button, icon), that the user can press.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext["AbstractContext<span class='properties'>id: string<br />_type: discriminator<br /></span>"] --> AbstractLocationContext;
      AbstractLocationContext --> PressableContext;
    class PressableContext diagramActive
  `}
  caption="Diagram: PressableContext"
  baseColor="blue"
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
The tracker will automatically set the `id` and `_type` based on the pressable element. When this is not possible on a specific platform, it will ask for a manual `id` and `_type` to be set.
:::
