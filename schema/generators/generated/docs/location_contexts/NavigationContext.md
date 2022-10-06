# NavigationContext
A Location Context that describes a section of the UI containing navigational elements, for example a menu.

### Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`discriminator` _type: A string literal used during serialization. Should always match the Context interface name.
