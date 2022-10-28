# LinkContext
A [PressableContext](/taxonomy/reference/location-contexts/PressableContext) that contains a href.

### Parent
PressableContext

### All Parents
AbstractContext > AbstractLocationContext > PressableContext

### Inherited Properties
id: `string` - A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.

### Properties
id: `string` [inherited] - A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
href: `string` - URL (href) the link points to.

:::info setting of the id & type
The tracker will automatically set the id and _type based on the link element. When this is not possible on a specific platform, it will ask for a manual id and _type to be set.
:::
