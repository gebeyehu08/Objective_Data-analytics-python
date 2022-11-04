# Objectiv Snowplow JavaScript Tracker Transport

Allows sending events directly via Snowplow's JavaScript Tracker without the need of the Objectiv Collector. 

---
## Package Installation
To install the most recent stable version:

```sh
yarn add @objectiv/transport-snowplow-javascript
```

### or
```sh
npm install @objectiv/transport-snowplow-javascript
```

# Usage
To enable SnowplowJavaScriptTransport, and stop using Objectiv's Collector, simply:
1. Remove the Objectiv's Collector `endpoint` configuration option. 
2. Add the `transport` configuration option, set to a new instance of `SnowplowJavaScriptTransport`.

### Browser SDK example
```ts
import { makeTracker } from "@objectiv/tracker-browser";
import { SnowplowJavaScriptTransport } from "@objectiv/transport-snowplow-javascript";

makeTracker({
  applicationId: 'app-id',
  transport: new SnowplowJavaScriptTransport()
});
```

### React SDK example
```ts
import { ReactTracker } from '@objectiv/tracker-react';
import { SnowplowJavaScriptTransport } from "@objectiv/transport-snowplow-javascript";

const tracker = new ReactTracker({
  applicationId: 'app-id',
  transport: new SnowplowJavaScriptTransport()
})
```

### Angular SDK example
```ts
import { ObjectivTrackerModule } from '@objectiv/tracker-angular';
import { SnowplowJavaScriptTransport } from "@objectiv/transport-snowplow-javascript";

...

@NgModule({
  ...
  imports: [
    ...
    ObjectivTrackerModule.forRoot({
      applicationId: 'app-id',
      transport: new SnowplowJavaScriptTransport()
    })
  ],
  ...
})

export class AppModule {
  ...
}
```


# Copyright and license
Licensed and distributed under the Apache 2.0 License (An OSI Approved License).

Copyright (c) 2022 Objectiv B.V.

All rights reserved.
