# LocaleContext
A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) describing the users' language ([ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)) and country ([ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements)).

### Parent
AbstractGlobalContext

### All Parents
AbstractContext > AbstractGlobalContext

### Own Properties
`string` language_code: Case sensitive ISO 639-1 language code. E.g. en, nl, fr, de, it, etc.
`string` country_code: Case sensitive ISO 3166-1 alpha-2 country code. E.g. US, NL, FR, DE, IT, etc.

### Inherited Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.

### All Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`string` language_code: Case sensitive ISO 639-1 language code. E.g. en, nl, fr, de, it, etc.
`string` country_code: Case sensitive ISO 3166-1 alpha-2 country code. E.g. US, NL, FR, DE, IT, etc.

:::info setting of properties
The tracker can automatically set the `id` when using the official Plugin. On manual creation, `id` must be provided. 
:::
