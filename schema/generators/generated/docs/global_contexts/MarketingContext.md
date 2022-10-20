# MarketingContext
A [GlobalContext](/taxonomy/global-contexts) describing the marketing channel & campaign from where the user came.

### Parent
AbstractGlobalContext

### All Parents
AbstractContext > AbstractGlobalContext

### Own Properties
`string` source: Identifies the advertiser, site, publication, etc.
`string` medium: Advertising or marketing medium: cpc, banner, email newsletter, etc.
`string` campaign: Individual campaign name, slogan, promo code, etc.
`string` term: Search keywords.
`string` content: Used to differentiate similar content, or links within the same ad.
`string` source_platform: To differentiate similar content, or links within the same ad.
`string` creative_format: Identifies the creative used (e.g., skyscraper, banner, etc).
`string` marketing_tactic: Identifies the marketing tactic used (e.g., onboarding, retention, acquisition etc).

### Inherited Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.

### All Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`string` source: Identifies the advertiser, site, publication, etc.
`string` medium: Advertising or marketing medium: cpc, banner, email newsletter, etc.
`string` campaign: Individual campaign name, slogan, promo code, etc.
`string` term: Search keywords.
`string` content: Used to differentiate similar content, or links within the same ad.
`string` source_platform: To differentiate similar content, or links within the same ad.
`string` creative_format: Identifies the creative used (e.g., skyscraper, banner, etc).
`string` marketing_tactic: Identifies the marketing tactic used (e.g., onboarding, retention, acquisition etc).

:::info setting of the properties
The backend will automatically set all the properties based on the UTM parameters in the PathContext.
:::
