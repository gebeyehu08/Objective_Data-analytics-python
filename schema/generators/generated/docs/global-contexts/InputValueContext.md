# InputValueContext

A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) containing the value of a single input element. Multiple InputValueContexts may be present in Global Contexts at the same time.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext["AbstractContext<span class='properties'>_types: array<br />id: string<br />_type: discriminator<br /></span>"] --> AbstractGlobalContext;
      AbstractGlobalContext -->       InputValueContext["InputValueContext<span class='properties'>value: string<br /></span>"];
    class InputValueContext diagramActive
  `}
  caption="Diagram: InputValueContext inheritance"
  baseColor="blue"
  links={[
{ name: 'AbstractContext', to: '/taxonomy/reference/abstracts/AbstractContext' },{ name: 'AbstractGlobalContext', to: '/taxonomy/reference/abstracts/AbstractGlobalContext' },  ]}
/>

### Properties

|           | type   | description                     | contains |
|:----------|:-------|:--------------------------------|:---------|
| **value** | string | The value of the input element. |          |
### Inherited Properties

|             | type          | description                                                                                                | contains                            |
|:------------|:--------------|:-----------------------------------------------------------------------------------------------------------|:------------------------------------|
| **\_types** | array         | An ordered list of the parents of this Context, itself included as the last element.                       | string                              |
| **id**      | string        | A unique string identifier to be combined with the Context Type (`_type`) for Context instance uniqueness. |                                     |
| **\_type**  | discriminator | A string literal used during serialization. Hardcoded to the Context name.                                 | ContextTypes.enum.InputValueContext |

:::info setting of properties
The tracker will automatically set all properties when using Tracked Components or Taggers. On manual creation `id` and `value` must be provided.
:::
