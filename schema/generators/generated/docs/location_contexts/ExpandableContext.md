# ExpandableContext
A [LocationContext](/taxonomy/reference/location-contexts/overview.md)  that describes a section of the UI that can expand & collapse.

### Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`discriminator` _type: A string literal used during serialization. Should always match the Context interface name.

:::info setting of the id & type
The tracker will automatically set the id and _type based on the expandable element. When this is not possible on a specific platform, it will ask for a manual id and _type to be set.
:::
