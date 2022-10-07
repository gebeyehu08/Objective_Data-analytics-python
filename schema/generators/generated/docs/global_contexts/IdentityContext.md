# IdentityContext


### Properties
`string` value: The unique identifier for this user/group/entity within the scope defined by `id`.
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`discriminator` _type: A string literal used during serialization. Should always match the Context interface name.


