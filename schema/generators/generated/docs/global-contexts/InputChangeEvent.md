# InputChangeEvent

A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) describing meta information about the current session.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext --> AbstractGlobalContext;
      AbstractGlobalContext --> InputChangeEvent["InputChangeEvent<br /><span class='properties'>hit_number: integer<br /></span>"];
    class InputChangeEvent diagramActive
  `}
  caption="Diagram: InputChangeEvent"
  baseColor="blue"
/>

### Requires

None.

### Properties

|                | type          | description                                                                                                 | contains |
|:---------------|:--------------|:------------------------------------------------------------------------------------------------------------|:---------|
| **hit_number** | integer       | Hit counter relative to the current session, this event originated in.                                      |          |
| **id**         | string        | A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness. |          |
| **_type**      | discriminator | A string literal used during serialization. Should always match the Context interface name.                 |          |

:::info setting of properties
The tracker will automatically set all the properties and assign a `hit_number`.
:::
                                                          |          |
| **term**             | string        | [Optional] Search keywords.                                                                                 |          |
| **content**          | string        | [Optional] Used to differentiate similar content, or links within the same ad.                              |          |
| **source_platform**  | string        | [Optional] To differentiate similar content, or links within the same ad.                                   |          |
| **creative_format**  | string        | [Optional] Identifies the creative used (e.g., skyscraper, banner, etc).                                    |          |
| **marketing_tactic** | string        | [Optional] Identifies the marketing tactic used (e.g., onboarding, retention, acquisition etc).             |          |
| **id**               | string        | A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness. |          |
| **_type**            | discriminator | A string literal used during serialization. Should always match the Context interface name.                 |          |

:::info setting of the properties
The backend will automatically set all the properties based on the UTM parameters in the PathContext.
:::
