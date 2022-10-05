# ApplicationLoadedEvent
A NonInteractive event that is emitted after an application (e.g. SPA) has finished loading.

### Properties
`LocationStack` location_stack: undefined
`GlobalContexts` global_contexts: undefined
`discriminator` _type: A string literal used during serialization. Should always match the Event interface name.
`uuid` id: Unique identifier for a specific instance of an event.
`integer` time: Timestamp indicating when the event was generated.
