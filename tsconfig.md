# TS Config

Sample:

```
{
  "compilerOptions": {
    "lib": ["es2015"],
    "module": "commonjs",
    "outDir": "dist",
    "sourceMap": true,
    "strict": true,
    "target": "es2015"
  },
  "include": [
    "src"
  ]
}
```

`include`

Which folders should TSC look in to find your TypeScript files?

`lib`

Which APIs should TSC assume exist in the environment you'll be running your
code in?

`module`

Which module system should TSC compile your code to?

`outDir`

Which folder should TSC put your generated JS code in?

`strict`

Be as strict as possible when checking for invalid code.

`target`

Which JavaScript version should TSC compile your code to?

## Interop with commonjs

When consuming a JavaScript module that use the CommonJS or AMD standard, you
can simply import names from it, just like for ES2015 modules:

```ts
import { something } from "./a/legacy/commonjs/module";
```

By default, CommonJS default exports don't interoperate with ES2015 default
imports; to use a default export, you have to use a wildcard import:

```ts
import * as fs from "fs";
fs.readFile("some/file.txt");
```

To interoperate more smoothly, set `{ "esModuleInterop": true }` in your
`tsconfig.json`'s `compilerOptions`. Now you can leave out the wildcard:

```ts
import fs from "fs";
fs.readFile("some/file.txt");
```

Note: Although this works at compile time, it doesn't mean it'll work at
runtime. It's important that the module loader and bundler, e.g. Webpack, is
aware of the format so that it can package it up and produce code correctly at
runtime.

## Module resolution flag

This flag controls the algorithm TypeScript uses to resolve module names in your
application. The flag supports two modes:

1. `node`: Always use this mode. It resolves modules using the same algorithm
   that NodeJS uses. Just like NodeJS, local path lookups work as expected, and
   paths that don't have a prefix load from `node_modules`, as expected.
   TypeScript builds on this in two ways though:
   1. In addition to the `main` field in `package.json` that NodeJS looks at to
      find the default importable file in a directory, TypeScript also looks at
      the TypeScript specific `types` property.
   2. When importing a file with an unspecified extension, TypeScript first
      looks for a file with that name and a `.ts` extension, followed by `.tsx`,
      `.d.ts` and finally `.js`.
1. `classic`: You should never use this mode. It's unconventional and does not
   behave like NodeJS, which everyone is already accustomed to.
