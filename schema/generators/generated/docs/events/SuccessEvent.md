# SuccessEvent
A [NonInteractiveEvent](/taxonomy/reference/events/NonInteractiveEvent.md) that is sent when a user action is successfully completed, like sending an email form.

### Parent
NonInteractiveEvent

### All Parents
AbstractEvent > NonInteractiveEvent

### Own Properties
`string` message: Success message.

### Inherited Properties
`LocationStack` location_stack: The location stack is an ordered list (stack), that contains a hierarchy of location contexts that 
deterministically describes where an event took place from global to specific. 
The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
`GlobalContexts` global_contexts: Global contexts add global / general information about the event. They carry information that is not 
related to where the Event originated (location), such as device, platform or business data.
`uuid` id: Unique identifier for a specific instance of an event.
`integer` time: Timestamp indicating when the event was generated.

### All Properties
`LocationStack` location_stack: The location stack is an ordered list (stack), that contains a hierarchy of location contexts that 
deterministically describes where an event took place from global to specific. 
The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
`GlobalContexts` global_contexts: Global contexts add global / general information about the event. They carry information that is not 
related to where the Event originated (location), such as device, platform or business data.
`uuid` id: Unique identifier for a specific instance of an event.
`integer` time: Timestamp indicating when the event was generated.
`string` message: Success message.

:::info setting of properties
The tracker will automatically set all the properties. The message is an error code or short message captured from the occurring success event. This is purely for descriptive purposes.
:::
