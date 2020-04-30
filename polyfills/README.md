# TypeScript and polyfills

TypeScript can compile down to support most language features, but some functionality will
require polyfills. The example here is for `Array.prototype.flat`.

This demonstrates running Babel, via Webpack, to compile the TS files into JS, and a task that can be
run in parallel to run the TypeScript compiler against the TS files to catch type errors.

The polyfills are from `core-js`; the imports are automatically handled by `@babel/preset-env`
inconjunction with the `useBuiltIns: 'usage'` configuration: Babel will automatically import
the required polyfills based on what's in the `package.json`'s `browserslist`.
