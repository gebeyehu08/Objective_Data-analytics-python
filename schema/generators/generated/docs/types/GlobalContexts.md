# GlobalContexts
Global contexts add global / general information about the event. They carry information that is not 
related to where the Event originated (location), such as device, platform or business data.

## Type

* array
## Items

* AbstractGlobalContext
## Rules
TODO explain the basic requirements of a valid Global Contexts

* RequiresGlobalContext
  * Context: ApplicationContext
* UniqueContext
  * Exclude Contexts: InputValueContext
    * By: _type,id
  * Include Contexts: InputValueContext
    * By: _type,id,value
