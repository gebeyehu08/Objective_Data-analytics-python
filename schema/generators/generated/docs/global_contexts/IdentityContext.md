# IdentityContext
A [GlobalContext](/taxonomy/reference/global-contexts/overview.md)  to track the identity of users across sessions, platforms, devices. Multiple can be present.
The `id` field is used to specify the scope of identification e.g. backend, md5(email), supplier_cookie, etc.
The `value` field should contain the unique identifier within that scope.

### Parent
AbstractGlobalContext

### All Parents
AbstractContext > AbstractGlobalContext

### Own Properties
`string` value: The unique identifier for this user/group/entity within the scope defined by `id`.

### Inherited Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.

### All Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`string` value: The unique identifier for this user/group/entity within the scope defined by `id`.

:::info setting of properties
The tracker will automatically set all properties when using the official Plugin. On manual creation, `id` and `value` must be provided.
:::
