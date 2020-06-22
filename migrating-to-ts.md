# Migrating to TypeScript

Tips for gradually migrating from a JavaScript project to TypeScript.

High level steps:

- Add TSC to your project.
- Start typechecking your existing JavaScript code.
- Migrate your JavaScripit code to TypeScript, a file at a time.
- Install type declarations for your dependencies, either stubbing out types for
  dependencies that don't have types or writing type declarations for untyped
  dependencies and contributing them back to DeinitelyTyped.
- Flip on strict mode mode your codebase.

This process can take a while, but you will see seafety and productivity gains
right away, and uncover more gains as you keep going.

## Step 1: Add TSC

Start by letting TSC compile JavaScript files alongside your TypeScript:

```json
{
  "compilerOptions": {
    "allowJs": true
  }
}
```

Add TSC to your build process, and eithe run every existing JavaScript file
through TSC, or continue running legacy JavaScript files through your existing
build process and run new TypeScript files through TSC.

With `allowJs` set to `true`, TypeScript won't typecheck your existing
JavaScript code, but it will transpile (to whatever is in `target`) it using the
module system you asked for (in `module`).

## Step 2a: Enable Typechecking for JavaScript (optional)

You might not have explicit type annotations in your JavaScript, but TypeScript
can infer types in your JavaScript the sam eway it does in your TypeScript code:

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true
  }
}
```

If your codebase is big and flipping on `checkJs` reports too many type error at
once, turn it off, and instead enable checking for a JavaScript file at a time
by adding the `// @ts-check` directive at the top of a file. Or, if a few big
files are throwing the bulk of your errors and you don't want to fix them just
yet, keep `checkJs` on and add the `// @ts-nocheck` directive to just those
files.

Because TypeScript can't infer everything, it will infer a lot of types in your
JavaScript code as `any`. If you have `strict` mode enabled, you may want to
temporarily allow implicit `any`s while you migrate:

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "noImplicitAny": false
  }
}
```

Don't forget to turn `noImplicitAny` on again when you've migrated a critical
mass of code to TypeScript.

## Step 2b: Add JSDoc Annotations (optional)

If you can't migrate a whole JavaScript file to TypeScript for whatever reason,
but perhaps need to add typechecking to an existing function within, you can use
a JSDoc annotation to type your new function:

```js
/**
 * @param arg1 {string} An input string
 * @returns {string} The converted string
 */
```

## Step 3: Rename your files to `.ts`

Once you've added TSC to your build process and optionally started typeschecking
and annotating JavaScript where possible, it's time to start switching over to
TypeScript.

One file at a time, update your files' extensions from `.js` to `.ts`. Each
renaming file may uncover type errors.

Two strategies to fix these new errors:

1. Do it right. Take your time to type shapes, fields and functions correctly,
   so you can catch errors in all the files that consume them. If you have
   `checkJs` enabled, turn on `noImplicitAny` to uncover `any`s and type them,
   then turn it back off to make the output of typeschecking your remaining
   JavaScript files less noisy.

2. Do it fast. Mass rename your JavaScript files to the `.ts` extension, and
   keep your `tsconfig.json` setting lax, e.g. `strict` to `false` to throw as
   few type errors as possible after renaming. Type complex types as `any` to
   appease the typechecker. Fix whatever type errors remain, and commit. Once
   this is done, flip on the `strict` mode flags (`noImplicitAny`,
   `noImplicitThis`, `strictNullChecks` and so on) one by one, and fix the
   errors that pop up.

If going for the quick and dirty approach, consider defining an ambient type
declaration `TODO` as a type alias for `any`, and use that instead of `any` to
track missing types:

```ts
// global.ts
type TODO_FROM_JS_TO_TS_MIGRATION = any;

// MyMigratedUtil.ts
export function mergeWidgets(
  widget1: TODO_FROM_JS_TO_TS_MIGRATION,
  widget2: TODO_FROM_JS_TO_TS_MIGRATION
): number {
  // ...
}
```

## Step 4: Make it strict

Once you've migrated the critical mass of your JavaScript code over to
TypeScript, you'll want to make your code as safe as possible by opting into
TSC's more stringent flags one by one.

Finally, you can disable TSC's JavaScript interoperability flags, enforcing that
all of your code is written in strictly typed TypeScript:

```json
{
  "compilerOptions": {
    "allowJs": false,
    "checkJs": false
  }
}
```

This will surface the final rounds of type-related errors. Fix these, and you're
left with a pristine and safe codebase.
