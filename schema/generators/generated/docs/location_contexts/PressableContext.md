# PressableContext
A Location Context that describes an interactive element (like a link, button, icon), 
that the user can press and will trigger an Interactive Event.

### Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`discriminator` _type: A string literal used during serialization. Should always match the Context interface name.
