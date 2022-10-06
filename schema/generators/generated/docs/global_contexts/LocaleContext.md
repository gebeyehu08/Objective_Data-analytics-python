# LocaleContext
A GlobalContext describing the users' language (ISO 639-1) and country (ISO 3166-1 alpha-2).

### Properties
`string` language_code: Case sensitive ISO 639-1 language code. E.g. en, nl, fr, de, it, etc.
`string` country_code: Case sensitive ISO 3166-1 alpha-2 country code. E.g. US, NL, FR, DE, IT, etc.
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`discriminator` _type: A string literal used during serialization. Should always match the Context interface name.
