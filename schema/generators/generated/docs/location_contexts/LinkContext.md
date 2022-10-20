# LinkContext
A [PressableContext](/taxonomy/reference/location-contexts/PressableContext) that contains a href.

### Parent
PressableContext

### All Parents
AbstractContext > AbstractLocationContext > PressableContext

### Own Properties
`string` href: URL (href) the link points to.

### Inherited Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.

### All Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`string` href: URL (href) the link points to.

:::info setting of the id & type
The tracker will automatically set the id and _type based on the link element. When this is not possible on a specific platform, it will ask for a manual id and _type to be set.
:::
