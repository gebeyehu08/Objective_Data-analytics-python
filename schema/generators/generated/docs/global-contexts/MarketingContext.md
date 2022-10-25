# MarketingContext

A [GlobalContext](/taxonomy/global-contexts) describing the marketing channel & campaign from where the user came.

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext["AbstractContext<span class='properties'>_types: array<br />id: string<br />_type: discriminator<br /></span>"] --> AbstractGlobalContext;
      AbstractGlobalContext -->       MarketingContext["MarketingContext<span class='properties'>source: string<br />medium: string<br />campaign: string<br />term?: string<br />content?: string<br />source_platform?: string<br />creative_format?: string<br />marketing_tactic?: string<br /></span>"];
    class MarketingContext diagramActive
  `}
  caption="Diagram: MarketingContext inheritance"
  baseColor="blue"
  links={[
{ name: 'AbstractContext', to: '/taxonomy/reference/abstracts/AbstractContext' },{ name: 'AbstractGlobalContext', to: '/taxonomy/reference/abstracts/AbstractGlobalContext' },  ]}
/>

### Properties

|                                    | type   | description                                                                          | contains |
|:-----------------------------------|:-------|:-------------------------------------------------------------------------------------|:---------|
| **source**                         | string | Identifies the advertiser, site, publication, etc.                                   |          |
| **medium**                         | string | Advertising or marketing medium: cpc, banner, email newsletter, etc.                 |          |
| **campaign**                       | string | Individual campaign name, slogan, promo code, etc.                                   |          |
| **term _[optional]_**              | string | Search keywords.                                                                     |          |
| **content _[optional]_**           | string | Used to differentiate similar content, or links within the same ad.                  |          |
| **source\_platform _[optional]_**  | string | To differentiate similar content, or links within the same ad.                       |          |
| **creative\_format _[optional]_**  | string | Identifies the creative used (e.g., skyscraper, banner, etc).                        |          |
| **marketing\_tactic _[optional]_** | string | Identifies the marketing tactic used (e.g., onboarding, retention, acquisition etc). |          |
### Inherited Properties

|             | type          | description                                                                                                | contains                           |
|:------------|:--------------|:-----------------------------------------------------------------------------------------------------------|:-----------------------------------|
| **\_types** | array         | An ordered list of the parents of this Context, itself included as the last element.                       | string                             |
| **id**      | string        | A unique string identifier to be combined with the Context Type (`_type`) for Context instance uniqueness. |                                    |
| **\_type**  | discriminator | A string literal used during serialization. Hardcoded to the Context name.                                 | ContextTypes.enum.MarketingContext |

:::info setting of the properties
The backend will automatically set all the properties based on the UTM parameters in the PathContext.
:::
