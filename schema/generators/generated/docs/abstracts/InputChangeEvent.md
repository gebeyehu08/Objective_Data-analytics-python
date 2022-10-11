# InputChangeEvent



import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext -->       AbstractContext --> InputChangeEvent;
    class InputChangeEvent diagramActive
  `}
  caption="Diagram: InputChangeEvent"
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


