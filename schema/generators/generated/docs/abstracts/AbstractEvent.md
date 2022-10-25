# AbstractEvent


### Own Children
InteractiveEvent, NonInteractiveEvent

### All Children
InteractiveEvent, NonInteractiveEvent, InputChangeEvent, PressEvent, ApplicationLoadedEvent, FailureEvent, HiddenEvent, MediaEvent, SuccessEvent, VisibleEvent, MediaLoadEvent, MediaPauseEvent, MediaStartEvent, MediaStopEvent

### Own Properties
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


