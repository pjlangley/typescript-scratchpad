# TypeScript & Babel

This demonstrates running Babel to compile the TS files into JS, and a task that can be
run in parallel to run the TypeScript compiler against the TS files to catch type errors.

For example, the source of:

```
import { add } from './utils';

const elem = document.createElement('div');
elem.innerHTML = `1 + 2 = ${add(1, 2)}`;

document.body.appendChild(elem);
```

Gets compiled to:

```
import { add } from './utils';
var elem = document.createElement('div');
elem.innerHTML = "1 + 2 = ".concat(add(1, 2));
document.body.appendChild(elem);
```

Based on the `browserslist` contents in `package.json`.
