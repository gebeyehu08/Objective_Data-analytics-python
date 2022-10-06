# SuccessEvent
A NonInteractiveEvent that is sent when a user action is successfully completed, 
like sending an email form.

### Properties
`string` message: Success message.
`LocationStack` location_stack: undefined
`GlobalContexts` global_contexts: undefined
`discriminator` _type: A string literal used during serialization. Should always match the Event interface name.
`uuid` id: Unique identifier for a specific instance of an event.
`integer` time: Timestamp indicating when the event was generated.
