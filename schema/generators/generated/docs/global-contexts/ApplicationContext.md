# ApplicationContext

A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) describing in which app the event happens, like a website or iOS app.

### Properties

|           | type          | description                                                                                                 | contains |
|:----------|:--------------|:------------------------------------------------------------------------------------------------------------|:---------|
| **id**    | string        | A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness. |          |
| **_type** | discriminator | A string literal used during serialization. Should always match the Context interface name.                 |          |

:::info setting of properties
The tracker will automatically set all properties and factor this context. On manual creation, `id` must be provided.
:::
