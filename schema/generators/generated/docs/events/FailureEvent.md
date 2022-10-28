# FailureEvent
A [NonInteractiveEvent](/taxonomy/reference/events/NonInteractiveEvent.md) that is sent when a user action results in a error, like an invalid email when sending a form.

### Parent
NonInteractiveEvent

### All Parents
AbstractEvent > NonInteractiveEvent

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
message: `string` - Failure message.

### Validation Rules
Global Contexts must contain ApplicationContext
GlobalContexts items must be unique by their _type+id, except InputValueContext
InputValueContext must be unique by their _type+id+value
LocationStack items must be unique by their _type+id

:::info setting of properties
The tracker will automatically set all the properties. The message is an error code or short message captured from the occurring error. This is purely for descriptive purposes.
:::
