# InputChangeEvent

An [InteractiveEvent](/taxonomy/reference/events/InteractiveEvent.md) that's triggered when user input is modified. Optionally, add an [InputValueContext](../global-contexts/InputValueContext.md) to track the input value from the user.

### Requires

* [InputContext](../location-contexts/InputContext.md).

### Properties

|                     | type           | description                                                                               | contains |
|:--------------------|:---------------|:------------------------------------------------------------------------------------------|:---------|
| **location_stack**  | LocationStack  |                                                                                           |          |
| **schema_version**  | string         | The version of the Objectiv Taxonomy Schema used to generate this event.                  |          |
| **global_contexts** | GlobalContexts |                                                                                           |          |
| **_type**           | discriminator  | A string literal used during serialization. Should always match the Event interface name. |          |
| **id**              | uuid           | Unique identifier for a specific instance of an event.                                    |          |
| **time**            | integer        | Timestamp indicating when the event was generated.                                        |          |

:::info setting of properties
The tracker will automatically set all the properties.
:::
