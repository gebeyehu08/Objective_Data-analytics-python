# AbstractEvent


### Properties
`string` schema_version: The version of the Objectiv Taxonomy Schema used to generate this event.
`array` _types: An ordered list of the parents of this Event, itself included as the last element.
`LocationStack` location_stack: undefined
`GlobalContexts` global_contexts: undefined
`discriminator` _type: A string literal used during serialization. Should always match the Event interface name.
`uuid` id: Unique identifier for a specific instance of an event.
`integer` time: Timestamp indicating when the event was generated.


