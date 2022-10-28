# AbstractEvent


### Own Children
InteractiveEvent, NonInteractiveEvent

### All Children
InteractiveEvent, NonInteractiveEvent, InputChangeEvent, PressEvent, ApplicationLoadedEvent, FailureEvent, HiddenEvent, MediaEvent, SuccessEvent, VisibleEvent, MediaLoadEvent, MediaPauseEvent, MediaStartEvent, MediaStopEvent

### Properties
location_stack: `LocationStack` - The location stack is an ordered list (stack), that contains a hierarchy of location contexts that 
deterministically describes where an event took place from global to specific. 
The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.
global_contexts: `GlobalContexts` - Global contexts add global / general information about the event. They carry information that is not 
related to where the Event originated (location), such as device, platform or business data.
id: `uuid` - Unique identifier for a specific instance of an event.
time: `integer` - Timestamp indicating when the event was generated.

### Validation Rules
Global Contexts must contain ApplicationContext
GlobalContexts items must be unique by their _type+id, except InputValueContext
InputValueContext must be unique by their _type+id+value
LocationStack items must be unique by their _type+id


