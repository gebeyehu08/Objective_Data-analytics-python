# PressEvent

An [InteractiveEvent](/taxonomy/reference/events/InteractiveEvent.md) that is sent when a user presses on a pressable element (like a link, button, icon). Optionally, add an [InputValueContext](../global-contexts/InputValueContext.md) to track the input value(s) from the user.

### Requires

* [PressableContext](../location-contexts/PressableContext.md).

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
