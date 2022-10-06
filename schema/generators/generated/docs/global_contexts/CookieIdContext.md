# CookieIdContext
Global context with information needed to reconstruct a user session.

### Properties
`string` cookie_id: Unique identifier from the session cookie.
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`discriminator` _type: A string literal used during serialization. Should always match the Context interface name.
