# MarketingContext
A [GlobalContext](/taxonomy/global-contexts) describing the marketing channel & campaign from where the user came.

### Properties
`string` source: Identifies the advertiser, site, publication, etc.
`string` medium: Advertising or marketing medium: cpc, banner, email newsletter, etc.
`string` campaign: Individual campaign name, slogan, promo code, etc.
`string` term: [Optional] Search keywords.
`string` content: [Optional] Used to differentiate similar content, or links within the same ad.
`string` source_platform: [Optional] To differentiate similar content, or links within the same ad.
`string` creative_format: [Optional] Identifies the creative used (e.g., skyscraper, banner, etc).
`string` marketing_tactic: [Optional] Identifies the marketing tactic used (e.g., onboarding, retention, acquisition etc).
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`discriminator` _type: A string literal used during serialization. Should always match the Context interface name.

:::info setting of the properties
The backend will automatically set all the properties based on the UTM parameters in the PathContext.
:::
