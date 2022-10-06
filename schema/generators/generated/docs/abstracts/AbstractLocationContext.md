# AbstractLocationContext
AbstractLocationContext are the abstract parents of all Location Contexts.
Location Contexts are meant to describe where an event originated from in the visual UI.

### Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`discriminator` _type: A string literal used during serialization. Should always match the Context interface name.
