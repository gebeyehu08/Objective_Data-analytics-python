# NavigationContext

A [LocationContext](/taxonomy/reference/location-contexts/overview.md) that describes a section of the UI containing navigational elements, for example a menu.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext["AbstractContext<span class='properties'>_types: array<br />id: string<br />_type: discriminator<br /></span>"] --> AbstractLocationContext;
      AbstractLocationContext -->       NavigationContext;
    class NavigationContext diagramActive
  `}
  caption="Diagram: NavigationContext inheritance"
  baseColor="blue"
  links={[
{ name: 'AbstractContext', to: '/taxonomy/reference/abstracts/AbstractContext' }, { name: 'AbstractLocationContext', to: '/taxonomy/reference/abstracts/AbstractLocationContext' },   ]}
/>

### Inherited Properties

|             | type          | description                                                                                                | contains                            |
|:------------|:--------------|:-----------------------------------------------------------------------------------------------------------|:------------------------------------|
| **\_types** | array         | An ordered list of the parents of this Context, itself included as the last element.                       | string                              |
| **id**      | string        | A unique string identifier to be combined with the Context Type (`_type`) for Context instance uniqueness. |                                     |
| **\_type**  | discriminator | A string literal used during serialization. Hardcoded to the Context name.                                 | ContextTypes.enum.NavigationContext |

:::info setting of the id & type
The tracker will automatically set the id and _type based on the navigation element. When this is not possible on a specific platform, it will ask for a manual id and _type to be set.
:::
