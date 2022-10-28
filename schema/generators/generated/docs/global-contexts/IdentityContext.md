# IdentityContext

A [GlobalContext](/taxonomy/reference/global-contexts/overview.md)  to track the identity of users across sessions, platforms, devices. Multiple can be present.
The `id` field is used to specify the scope of identification e.g. backend, md5(email), supplier_cookie, etc.
The `value` field should contain the unique identifier within that scope.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext["AbstractContext<span class='properties'>id: string<br /></span>"] --> AbstractGlobalContext;
      AbstractGlobalContext -->       IdentityContext["IdentityContext<span class='properties'>value: string<br /></span>"];
    class IdentityContext diagramActive
  `}
  caption="Diagram: IdentityContext inheritance"
  baseColor="blue"
  links={[
{ name: 'AbstractGlobalContext', to: '/taxonomy/global-contexts' },   ]}
/>

### Properties

|           | type   | description                                                                        |
|:----------|:-------|:-----------------------------------------------------------------------------------|
| **value** | string | The unique identifier for this user/group/entity within the scope defined by `id`. |
### Inherited Properties

|        | type   | description                                                                                                |
|:-------|:-------|:-----------------------------------------------------------------------------------------------------------|
| **id** | string | A unique string identifier to be combined with the Context Type (`_type`) for Context instance uniqueness. |

:::info setting of properties
The tracker will automatically set all properties when using the official Plugin. On manual creation, `id` and `value` must be provided.
:::
