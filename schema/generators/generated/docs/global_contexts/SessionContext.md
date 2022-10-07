# SessionContext


### Properties
`integer` hit_number: Hit counter relative to the current session, this event originated in.
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`discriminator` _type: A string literal used during serialization. Should always match the Context interface name.


