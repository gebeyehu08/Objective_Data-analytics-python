# OverlayContext

A [LocationContext](/taxonomy/reference/location-contexts/overview.md) that describes a section of the UI that represents an overlay, i.e. a Modal.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext["AbstractContext<span class='properties'>id: string<br />_type: discriminator<br /></span>"] --> AbstractLocationContext;
      AbstractLocationContext --> OverlayContext;
    class OverlayContext diagramActive
  `}
  caption="Diagram: OverlayContext"
  baseColor="blue"
  links={[
    { name: 'AbstractContext', to: '/taxonomy/reference/abstracts/AbstractContext' },
    { name: 'AbstractLocationContext', to: '/taxonomy/reference/abstracts/AbstractLocationContext' },
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
The tracker will automatically set the id and _type based on the overlay element. When this is not possible on a specific platform, it will ask for a manual id and _type to be set.
:::
