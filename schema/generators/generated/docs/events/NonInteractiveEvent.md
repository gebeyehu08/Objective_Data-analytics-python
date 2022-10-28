# NonInteractiveEvent
The parent of [Events](/taxonomy/events) that are not directly triggered by a user action.

### Parent
AbstractEvent

### All Parents
AbstractEvent

### Own Children
ApplicationLoadedEvent, FailureEvent, HiddenEvent, MediaEvent, SuccessEvent, VisibleEvent

### All Children
ApplicationLoadedEvent, FailureEvent, HiddenEvent, MediaEvent, SuccessEvent, VisibleEvent, MediaLoadEvent, MediaPauseEvent, MediaStartEvent, MediaStopEvent

### Inherited Properties
location_stack: `LocationStack` - The location stack is an ordered list (stack), that contains a hierarchy of location contexts that 
deterministically describes where an event took place from global to specific. 
The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
global_contexts: `GlobalContexts` - Global contexts add global / general information about the event. They carry information that is not 
related to where the Event originated (location), such as device, platform or business data.
id: `uuid` - Unique identifier for a specific instance of an event.
time: `integer` - Timestamp indicating when the event was generated.

### Properties
location_stack: `LocationStack` [inherited] - The location stack is an ordered list (stack), that contains a hierarchy of location contexts that 
deterministically describes where an event took place from global to specific. 
The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
global_contexts: `GlobalContexts` [inherited] - Global contexts add global / general information about the event. They carry information that is not 
related to where the Event originated (location), such as device, platform or business data.
id: `uuid` [inherited] - Unique identifier for a specific instance of an event.
time: `integer` [inherited] - Timestamp indicating when the event was generated.

### Validation Rules
Global Contexts must contain ApplicationContext
GlobalContexts items must be unique by their _type+id, except InputValueContext
InputValueContext must be unique by their _type+id+value
LocationStack items must be unique by their _type+id


