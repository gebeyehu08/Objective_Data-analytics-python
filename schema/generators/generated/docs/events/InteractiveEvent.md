# InteractiveEvent
The parent of [Events](/taxonomy/events) that are the direct result of a user interaction, e.g. a button click.

### Parent
AbstractEvent

### All Parents
AbstractEvent

### Own Children
InputChangeEvent, PressEvent

### All Children
InputChangeEvent, PressEvent

### Own Properties
`LocationStack` location_stack: The location stack is an ordered list (stack), that contains a hierarchy of location contexts that 
deterministically describes where an event took place from global to specific. 
The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.

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
Global Contexts must contain PathContext
GlobalContexts items must be unique by their _type+id, except InputValueContext
InputValueContext must be unique by their _type+id+value
Location Stack must contain RootLocationContext at index 0
LocationStack items must be unique by their _type+id


