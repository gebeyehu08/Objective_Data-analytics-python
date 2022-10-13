# VisibleEvent
A [NonInteractiveEvent](/taxonomy/reference/events/NonInteractiveEvent.md) that's emitted after a [LocationContext](/taxonomy/reference/location-contexts/overview.md) has become visible.

### Properties
`LocationStack` location_stack: undefined
`GlobalContexts` global_contexts: undefined
`discriminator` _type: A string literal used during serialization. Should always match the Event interface name.
`uuid` id: Unique identifier for a specific instance of an event.
`integer` time: Timestamp indicating when the event was generated.

:::info setting of properties
The tracker will automatically set all the properties.
:::
