# InteractiveEvent

The parent of [Events](/taxonomy/events) that are the direct result of a user interaction, e.g. a button click.

### Requires

[RootLocationContext](../location-contexts/RootLocationContext.md)* undefined
[PathContext](../global-contexts/PathContext.md)* undefined

### Properties
`LocationStack` location_stack: undefined
`string` schema_version: The version of the Objectiv Taxonomy Schema used to generate this event.
`GlobalContexts` global_contexts: undefined
`discriminator` _type: A string literal used during serialization. Should always match the Event interface name.
`uuid` id: Unique identifier for a specific instance of an event.
`integer` time: Timestamp indicating when the event was generated.


