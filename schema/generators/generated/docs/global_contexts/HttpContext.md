# HttpContext


### Properties
`string` referrer: Full URL to HTTP referrer of the current page.
`string` user_agent: User-agent of the agent that sent the event.
`string` remote_address: (public) IP address of the agent that sent the event.
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`discriminator` _type: A string literal used during serialization. Should always match the Context interface name.


