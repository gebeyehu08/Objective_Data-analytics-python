# CookieIdContext
A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) describing information needed to reconstruct a user session.

### Properties
`string` cookie_id: Unique identifier from the session cookie.
`array` _types: An ordered list of the parents of this Context, itself included as the last element.
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`discriminator` _type: A string literal used during serialization. Should always match the Context interface name.

:::info setting of properties
The collector will automatically set all the properties and assign a `cookie_id`.
:::
