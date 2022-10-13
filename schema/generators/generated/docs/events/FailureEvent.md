# FailureEvent
A [NonInteractiveEvent](/taxonomy/reference/events/NonInteractiveEvent.md) that is sent when a user action results in a error, like an invalid email when sending a form.

### Properties
`string` message: Failure message.
`LocationStack` location_stack: undefined
`GlobalContexts` global_contexts: undefined
`discriminator` _type: A string literal used during serialization. Should always match the Event interface name.
`uuid` id: Unique identifier for a specific instance of an event.
`integer` time: Timestamp indicating when the event was generated.

:::info setting of properties
The tracker will automatically set all the properties. The message is an error code or short message captured from the occurring error. This is purely for descriptive purposes.
:::
