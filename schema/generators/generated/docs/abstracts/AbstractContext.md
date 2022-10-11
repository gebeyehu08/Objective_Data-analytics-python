# AbstractContext



import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
            AbstractContext["AbstractContext<span class='properties'>id: string<br />_type: discriminator<br /></span>"];
    class AbstractContext diagramActive
  `}
  caption="Diagram: AbstractContext"
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


