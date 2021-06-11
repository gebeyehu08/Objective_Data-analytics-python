# Objectiv WebTracker 
[PLACEHOLDER: Objectiv WebTracker introductory text]

---
# Installing
To install the most recent stable version:

### yarn
```sh
yarn add @objectiv/tracker-web
```

### npm
```sh
npm install @objectiv/tracker-web
```

# Usage

### ESModule
```javascript
import { WebTracker } from '@objectiv/tracker-web';
const webTracker = new WebTracker({ endpoint: '/collector' });
```

### CommonJS
```javascript
const objectiv = require('@objectiv/tracker-web');
const webTracker = new objectiv.WebTracker({ endpoint: '/collector' });
```

### IIFE
```html
<script src="dist/index.iife.js"></script>
<script>
  const webTracker = new objectiv.WebTracker({ endpoint: '/collector' });
</script>
```

### AMD
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js"></script>
<script>
  window.requirejs(['dist/index'], function(objectiv) {
    const webTracker = new objectiv.WebTracker({ endpoint: '/collector' });
  });
</script>
```