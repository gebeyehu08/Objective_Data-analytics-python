# NavigationContext

A [LocationContext](/taxonomy/reference/location-contexts/overview.md) that describes a section of the UI containing navigational elements, for example a menu.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext["AbstractContext<span class='properties'>id: string<br /></span>"] --> AbstractLocationContext;
      AbstractLocationContext -->       NavigationContext;
    class NavigationContext diagramActive
  `}
  caption="Diagram: NavigationContext inheritance"
  baseColor="blue"
  links={[
{ name: 'AbstractLocationContext', to: '/taxonomy/location-contexts' },   ]}
/>

### Inherited Properties

|        | type   | description                                                                                                |
|:-------|:-------|:-----------------------------------------------------------------------------------------------------------|
| **id** | string | A unique string identifier to be combined with the Context Type (`_type`) for Context instance uniqueness. |

:::info setting of the id & type
The tracker will automatically set the id and _type based on the navigation element. When this is not possible on a specific platform, it will ask for a manual id and _type to be set.
:::
