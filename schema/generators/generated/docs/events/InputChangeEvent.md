# InputChangeEvent
An [InteractiveEvent](/taxonomy/reference/events/InteractiveEvent.md) that's triggered when user input is modified. Optionally, add an [InputValueContext](../global-contexts/InputValueContext.md) to track the input value from the user.

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
