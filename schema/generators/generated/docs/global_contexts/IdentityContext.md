# IdentityContext
A Global Context to track the identity of users across sessions, platforms, devices. Multiple can be present.
The `id` field is used to specify the scope of identification e.g. backend, md5(email), supplier_cookie, etc.
The `value` field should contain the unique identifier within that scope.
