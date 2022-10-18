# CookieIdContext
A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) describing information needed to reconstruct a user session.

### Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`string` cookie_id: Unique identifier from the session cookie.

:::info setting of properties
The collector will automatically set all the properties and assign a `cookie_id`.
:::
