# InteractiveEvent

The parent of [Events](/taxonomy/events) that are the direct result of a user interaction, e.g. a button click.

### Requires

* [RootLocationContext](../location-contexts/RootLocationContext.md).
* [PathContext](../global-contexts/PathContext.md).

### Properties

|                     | type           | description                                                                               | contains |
|:--------------------|:---------------|:------------------------------------------------------------------------------------------|:---------|
| **location_stack**  | LocationStack  |                                                                                           |          |
| **schema_version**  | string         | The version of the Objectiv Taxonomy Schema used to generate this event.                  |          |
| **global_contexts** | GlobalContexts |                                                                                           |          |
| **_type**           | discriminator  | A string literal used during serialization. Should always match the Event interface name. |          |
| **id**              | uuid           | Unique identifier for a specific instance of an event.                                    |          |
| **time**            | integer        | Timestamp indicating when the event was generated.                                        |          |


