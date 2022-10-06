# ContentContext
A Location Context that describes a logical section of the UI that contains other Location Contexts. 
Enabling Data Science to analyze this section specifically.

### Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`discriminator` _type: A string literal used during serialization. Should always match the Context interface name.
