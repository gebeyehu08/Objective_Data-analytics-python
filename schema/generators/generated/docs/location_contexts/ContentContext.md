# ContentContext
A [LocationContext](/taxonomy/reference/location-contexts/overview.md) that describes a logical section of the UI that contains other Location Contexts. Enabling Data Science to analyze this section specifically.

### Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.

:::info setting of the id & type
The tracker will automatically set the id and _type based on the navigation element. When this is not possible on a specific platform, it will ask for a manual id and _type to be set.
:::
