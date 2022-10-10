# SuccessEvent

A [NonInteractiveEvent](/taxonomy/reference/events/NonInteractiveEvent.md) that is sent when a user action is successfully completed, like sending an email form.

### Requires

None.

### Properties

|                     | type           | description                                                                               | contains |
|:--------------------|:---------------|:------------------------------------------------------------------------------------------|:---------|
| **message**         | string         | Success message.                                                                          |          |
| **schema_version**  | string         | The version of the Objectiv Taxonomy Schema used to generate this event.                  |          |
| **location_stack**  | LocationStack  |                                                                                           |          |
| **global_contexts** | GlobalContexts |                                                                                           |          |
| **_type**           | discriminator  | A string literal used during serialization. Should always match the Event interface name. |          |
| **id**              | uuid           | Unique identifier for a specific instance of an event.                                    |          |
| **time**            | integer        | Timestamp indicating when the event was generated.                                        |          |

:::info setting of properties
The tracker will automatically set all the properties. The message is an error code or short message captured from the occurring success event. This is purely for descriptive purposes.
:::
