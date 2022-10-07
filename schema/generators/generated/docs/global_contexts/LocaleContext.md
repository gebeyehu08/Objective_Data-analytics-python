# LocaleContext
A [GlobalContext](/taxonomy/global-contexts) describing the users' language ([ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)) and country ([ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements)).

### Properties
`string` language_code: Case sensitive ISO 639-1 language code. E.g. en, nl, fr, de, it, etc.
`string` country_code: Case sensitive ISO 3166-1 alpha-2 country code. E.g. US, NL, FR, DE, IT, etc.
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`discriminator` _type: A string literal used during serialization. Should always match the Context interface name.

:::info setting of properties
The tracker can automatically set the `id` when using the official Plugin. On manual creation, `id` must be provided. 
:::
