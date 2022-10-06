# IdentityContext
A Global Context to track the identity of users across sessions, platforms, devices. Multiple can be present.
The `id` field is used to specify the scope of identification e.g. backend, md5(email), supplier_cookie, etc.
The `value` field should contain the unique identifier within that scope.

### Properties
`string` value: The unique identifier for this user/group/entity within the scope defined by `id`.
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`discriminator` _type: A string literal used during serialization. Should always match the Context interface name.
