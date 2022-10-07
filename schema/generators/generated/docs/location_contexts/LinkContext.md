# LinkContext
A [PressableContext](/taxonomy/reference/location-contexts/PressableContext) that contains an href.

### Properties
`string` href: URL (href) the link points to.
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`discriminator` _type: A string literal used during serialization. Should always match the Context interface name.

:::info setting of the id & type
The tracker will automatically set the id and _type based on the link element. When this is not possible on a specific platform, it will ask for a manual id and _type to be set.
:::
