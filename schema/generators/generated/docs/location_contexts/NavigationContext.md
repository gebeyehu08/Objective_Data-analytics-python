# NavigationContext
A [LocationContext](/taxonomy/reference/location-contexts/overview.md) that describes a section of the UI containing navigational elements, for example a menu.

### Parent
AbstractLocationContext

### All Parents
AbstractContext > AbstractLocationContext

### Inherited Properties
id: `string` - A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.

### Properties
id: `string` [inherited] - A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.

:::info setting of the id & type
The tracker will automatically set the id and _type based on the navigation element. When this is not possible on a specific platform, it will ask for a manual id and _type to be set.
:::
