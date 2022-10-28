# LocationStack
The location stack is an ordered list (stack), that contains a hierarchy of location contexts that 
deterministically describes where an event took place from global to specific. 
The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.

## Type

* array
## Items

* AbstractLocationContext
## Validation Rules
TODO explain the basic requirements of a valid Location Stack

* Items in `undefined` should have a unique combination of `{_type, id}` properties.

