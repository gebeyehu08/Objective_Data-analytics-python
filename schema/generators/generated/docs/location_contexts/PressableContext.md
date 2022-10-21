# PressableContext
A [LocationContext](/taxonomy/reference/location-contexts/overview.md) that describes an interactive element (like a link, button, icon), that the user can press.

### Parent
AbstractLocationContext

### All Parents
AbstractContext > AbstractLocationContext

### Own Children
LinkContext

### All Children
LinkContext

### Inherited Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.

### All Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.

:::info setting of the id & type
The tracker will automatically set the `id` and `_type` based on the pressable element. When this is not possible on a specific platform, it will ask for a manual `id` and `_type` to be set.
:::
