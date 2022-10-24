# OverlayContext
A [LocationContext](/taxonomy/reference/location-contexts/overview.md) that describes a section of the UI that represents an overlay, i.e. a Modal.

### Parent
AbstractLocationContext

### All Parents
AbstractContext > AbstractLocationContext

### Inherited Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.

### All Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.

:::info setting of the id & type
The tracker will automatically set the id and _type based on the overlay element. When this is not possible on a specific platform, it will ask for a manual id and _type to be set.
:::
