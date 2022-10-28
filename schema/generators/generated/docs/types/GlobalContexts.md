# GlobalContexts
Global contexts add global / general information about the event. They carry information that is not 
related to where the Event originated (location), such as device, platform or business data.

## Type

* array
## Items

* AbstractGlobalContext
## Validation Rules
TODO explain the basic requirements of a valid Global Contexts

* `GlobalContexts` should contain `ApplicationContext`.
* InputValueContext should have a unique combination of `{_type, id, value}` properties.
* Items in `undefined` should have a unique combination of `{_type, id}` properties, except for `InputValueContext`.

