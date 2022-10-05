# AbstractContext
AbstractContext defines the bare minimum properties for every Context. All Contexts inherit from it.

### Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`discriminator` _type: A string literal used during serialization. Should always match the Context interface name.
