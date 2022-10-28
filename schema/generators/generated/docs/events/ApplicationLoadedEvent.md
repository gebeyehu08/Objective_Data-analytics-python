# ApplicationLoadedEvent
A [NonInteractiveEvent](/taxonomy/reference/events/NonInteractiveEvent.md) that is emitted after an application (eg. SPA) or a website has finished loading.

### Parent
NonInteractiveEvent

### All Parents
AbstractEvent > NonInteractiveEvent

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

### Validation Rules
Global Contexts must contain ApplicationContext
GlobalContexts items must be unique by their _type+id, except InputValueContext
InputValueContext must be unique by their _type+id+value
LocationStack items must be unique by their _type+id

:::info setting of properties
The tracker will automatically set all the properties.
:::
