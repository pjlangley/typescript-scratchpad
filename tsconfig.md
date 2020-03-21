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

Which APIs should TSC assume exist in the environment you'll be running your code in?

`module`

Which module system should TSC compile your code to?

`outDir`

Which folder should TSC put your generated JS code in?

`strict`

Be as strict as possible when checking for invalid code.

`target`

Which JavaScript version should TSC compile your code to?
