# AbstractGlobalContext
This is the abstract parent of all Global Contexts. Global contexts add general information to an Event.

### Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`discriminator` _type: A string literal used during serialization. Should always match the Context interface name.
