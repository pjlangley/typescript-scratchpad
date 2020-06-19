# Project references

As your application grows, it will take longer and longer for TSC to typecheck
and compile your code. This time grows roughly linearly with the size of your
codebase. When developing locally, slow incremental compile times can serioiusly
slow down your development, and make working with TypeScript painful.

To address this, TSC comes with a feature called _project references_ that
speeds up compilation times dramatically, including incremental compile times.
For any project with a few hundred files or more, project references are a
must-have.

Approach explained:

- Independent modules; `ModuleA` and `ModuleB`. These have their own
  `tsconfig.json` and when built produce output (source and typings) to their
  own `dist` folder. If these modules get updated, it's important to run
  `tsc --build` again to refresh the `dist` folder.
- The module `ModuleA`, depends on `ModuleB`, so its `tsconfig.json` declares
  this `references`.
- The root `tsconfig.json` is for `./src/index.ts`, and declares the `ModuleA`
  dependency in `references`. This is the entry file and should ensure TSC can
  reach and compile all linked modules. Because TSC is **not** the bundler, I've
  set `noEmit` to `true`, so that we don't create a `dist` version of
  `index.ts`. Instead, we leave this to our bundler, Webpack.
- With the help of Babel, Webpack is configured to read from our entry point of
  `./src/index.ts` and parses the TypeScript in order to produce a bundle
  compatible with whatever JavaScript runtime environment we need to support.
  We've specified what browser support is required by using the `browserslist`
  field in `package.json`.
