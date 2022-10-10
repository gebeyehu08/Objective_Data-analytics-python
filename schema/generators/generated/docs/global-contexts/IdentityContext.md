# IdentityContext

A [GlobalContext](/taxonomy/reference/global-contexts/overview.md)  to track the identity of users across sessions, platforms, devices. Multiple can be present.

### Properties

|           | type          | description                                                                                                 | contains |
|:----------|:--------------|:------------------------------------------------------------------------------------------------------------|:---------|
| **value** | string        | The unique identifier for this user/group/entity within the scope defined by `id`.                          |          |
| **id**    | string        | A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness. |          |
| **_type** | discriminator | A string literal used during serialization. Should always match the Context interface name.                 |          |

:::info setting of properties
The tracker will automatically set all properties when using the official Plugin. On manual creation, `id` and `value` must be provided.
:::
