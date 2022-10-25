# LinkContext

A [PressableContext](/taxonomy/reference/location-contexts/PressableContext) that contains a href.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext["AbstractContext<span class='properties'>_types: array<br />id: string<br />_type: discriminator<br /></span>"] --> AbstractLocationContext;
      AbstractLocationContext --> PressableContext -->       LinkContext["LinkContext<span class='properties'>href: string<br /></span>"];
    class LinkContext diagramActive
  `}
  caption="Diagram: LinkContext inheritance"
  baseColor="blue"
  links={[
{ name: 'AbstractContext', to: '/taxonomy/reference/abstracts/AbstractContext' }, { name: 'AbstractLocationContext', to: '/taxonomy/reference/abstracts/AbstractLocationContext' }, { name: 'PressableContext', to: '/taxonomy/reference/location-contexts/PressableContext' },   ]}
/>

### Properties

|          | type   | description                    | contains |
|:---------|:-------|:-------------------------------|:---------|
| **href** | string | URL (href) the link points to. |          |
### Inherited Properties

|             | type          | description                                                                                                | contains                      |
|:------------|:--------------|:-----------------------------------------------------------------------------------------------------------|:------------------------------|
| **\_types** | array         | An ordered list of the parents of this Context, itself included as the last element.                       | string                        |
| **id**      | string        | A unique string identifier to be combined with the Context Type (`_type`) for Context instance uniqueness. |                               |
| **\_type**  | discriminator | A string literal used during serialization. Hardcoded to the Context name.                                 | ContextTypes.enum.LinkContext |

:::info setting of the id & type
The tracker will automatically set the id and _type based on the link element. When this is not possible on a specific platform, it will ask for a manual id and _type to be set.
:::
