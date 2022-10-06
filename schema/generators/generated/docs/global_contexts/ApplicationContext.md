# ApplicationContext
A GlobalContext describing in which app the event happens, like a website or iOS app.

### Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`discriminator` _type: A string literal used during serialization. Should always match the Context interface name.
