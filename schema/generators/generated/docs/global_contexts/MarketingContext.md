# MarketingContext
A [GlobalContext](/taxonomy/global-contexts) describing the marketing channel & campaign from where the user came.

### Parent
AbstractGlobalContext

### All Parents
AbstractContext > AbstractGlobalContext

### Inherited Properties
id: `string` - A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.

### Properties
id: `string` [inherited] - A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
source: `string` - The advertiser, site, publication, etc.
medium: `string` - Advertising or marketing medium: cpc, banner, email newsletter, etc.
campaign: `string` - Campaign name, slogan, promo code, etc.
term: `string` [nullable] - Search keywords.
content: `string` [nullable] - To differentiate similar content, or links within the same ad.
source_platform: `string` [nullable] - Identifies the platform where the marketing activity was undertaken.
creative_format: `string` [nullable] - Identifies the creative used (e.g., skyscraper, banner, etc).
marketing_tactic: `string` [nullable] - Identifies the marketing tactic used (e.g., onboarding, retention, acquisition etc).

:::info setting of the properties
The backend will automatically set all the properties based on the UTM parameters in the PathContext.
:::
