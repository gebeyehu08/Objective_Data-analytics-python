# MediaEvent

The parent of [non-interactive events](/taxonomy/reference/events/NonInteractiveEvent.md) that are triggered by a media player. It requires a [MediaPlayerContext](/taxonomy/reference/location-contexts/MediaPlayerContext) to detail the origin of the event.

### Requires

[MediaPlayerContext](../location-contexts/MediaPlayerContext.md)* undefined

### Properties
`string` schema_version: The version of the Objectiv Taxonomy Schema used to generate this event.
`LocationStack` location_stack: undefined
`GlobalContexts` global_contexts: undefined
`discriminator` _type: A string literal used during serialization. Should always match the Event interface name.
`uuid` id: Unique identifier for a specific instance of an event.
`integer` time: Timestamp indicating when the event was generated.

:::info setting of properties
The tracker will automatically set all the properties.
:::
