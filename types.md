# Types and terminology of patterns

## Unknown

Like `any`, `unknown` represents any value, but TypeScript won't let you use an
`unknown` type until you refine it by checking what it is.

Here are some things you can do:

```
let a: unknown = 30; // unknown
let b = a === 123; // boolean
let c = a + 10; // Error TS2571: Object is of type 'unknown'.
if (typeof a === 'number') {
  let d = a + 10; // number
}
```

- TS will never infer something as unknown; it must be explicit.
- You can compare values to values that are of type `unknown`.
- You can't do things that assume an `unknown` value is of a specific type; you
  have to prove to TS that the value really is of that type first.

## Type literals

For example, you can type a `boolean` as a literal value:

```
let a: true = true;
```

`a` isn't just a boolean, it is the specific `boolean` `true`.

## Index Signatures

The `[key: T]: U` syntax is called an _index signature_, and this is the way you
tell TypeScript that the given object might contain more keys. This allows you
to safely add more keys to an object, in addition to any keys that you
explicitly declared.

The index signature key's type (`T`) must be assignable to either `number` or
`string`.

```
let cinemaSeatAssignment: {
  [seatNumber: string]: string
} = {
  '11a': 'Peter',
  '11b': 'Paul'
};
```

## Union types

I.e. everything in A, or B, or both.

```
type YesOrNo = 'yes' | 'no';
```

A value with a union type isn't necessarily one specific member of the union: it
can be multiple members at once.

```
type Cat = { name: string, purrs: boolean };
type Dog = { name: string, barks: boolean };
type CatOrDogOrBoth = Cat | Dog;

let notACat: CatOrDogOrBoth = {
  name: 'Kitty',
  purrs: true,
  barks: true,
}
```

This cat can both _purr_ and _bark_.

## Intersection types

I.e. everything in both A and B.

```
type Cat = { name: string, purrs: boolean };
type Dog = { name: string, barks: boolean };
type CatAndDog = Cat & Dog;

let superCat: CatAndDog = {
  name: 'Kitty',
  purrs: true,
  barks: true,
}
```

## Tuples

Tuples are subtypes of `array`. They're a special way to type arrays that have
fixed lengths, where the values at each index have specific known types.

```
let a: [number] = [1];
let b: [string, string, number] = ['peter', 'paul', 1987];
let trainFares: [number, number?][] = [
  [5.77],
  [4.49, 2.28]
];
let friends: [string, ...string[]];
```

## Enums

Not as safe as you may expect:

```
enum Flippable {
  Burger,
  Pancake,
  Plate,
}

function flip(f: Flippable) {
  return 'flipped it';
}

flip(Flippable.Burger);
flip(Flippable.Pancake);
flip(3);
let a: Flippable = 8;
```

A safer approach is to avoid numeric values:

```
enum Flippable {
  Burger = 'Burger',
  Pancake = 'Pancake',
  Plate = 'Plate',
}

let a: Flippable = 8; // Type '8' is not assignable to type 'Flippable'. ts(2322)
```

## Iterable & Iterator

Any object that contains a property called `Symbol.iterator`, whose value is a
function that returns an iterator.

```
let numbers = {
  *[Symbol.iterator]() {
    for (let n = 1; n <= 10; n++) {
      yield n;
    }
  }
}
```

## Functions

```
type Sum = (a: number, b: number) => number;

const sum: Sum = (a, b) => {
  return a + b;
}
```

Declaring a callback parameter:

```
function log(
  message: string,
  f: (error: boolean) => void,
) {
  console.log('Hello');
  f(false);
}
```

Typing a function with a property:

```
type WarnUser = {
  (warning: string): void
  wasCalled: boolean
};

const warnUser: WarnUser = (warning) => {
  if (warnUser.wasCalled) {
    return;
  }

  warnUser.wasCalled = true;
  alert(warning);
}
warnUser.wasCalled = false;
```

## Generics

Filter example:

```
type Filter = {
  <T>(array: T[], f: (item: T) => boolean): T[]
}

const filter: Filter = (array, f) => {
  let result = [];
  array.forEach((item) => {
    if (f(item)) {
      result.push(item);
    }
  });
  return result;
}

let names = ['Peter', 'Paul', 'Suzy'];
let beginsWithP = filter(names, (name) => name.startsWith('P'));
```

## Generic binding

With this example:

```
type Filter = {
  <T>(array: T[], f: (item: T) => boolean): T[]
}
```

Because `<T>` is part of the call signature, right before the signature's
opening parenthesis, `()`, TypeScript will bind a concrete type to `T` when we
actually call a function of type `Filter`.

If we'd instead scoped `T` to the type alias `Filter`, TypeScript would have
required us to bind a type explicitly when we used `Filter`:

```
type Filter<T> = {
  (array: T[], f: (item: T) => boolean): T[]
}

const filter: Filter<string> = (array, f) => ...
```

This is called a "full signature call":

```
type Filter<T> = {
  (array: T[], f: (item: T) => boolean): T[]
}
```

This equivalent is called a "shorthand signature call":

```
type Filter<T> = (array: T[], f: (item: T) => boolean) => T[];
```

### Nested type inference

```
type MyEvent<T> = {
  target: T
  type: string
}

type ButtonType = MyEvent<HTMLButtonElement>

type TimedEvent<T> = {
  event: MyEvent<T>
  from: Date
  to: Date
}
```

### Bounded generics

Here's an example:

```
type Shape = {
  name: string
  colour: string
}

type Square = Shape & {
  sides: 4
}

function changeColour<T extends Shape>(shape: T, colour: string): T {
  console.log(shape.name);
  return {
    ...shape,
    colour,
  };
}

const square: Square = {
  colour: "blue",
  name: "square",
  sides: 4
}

const redSquare = changeColour(square, 'red'); // type remains Square, not Shape
```

Advantages of binding the generic (`T extends Shape`):

- If it was just typed `T`, TypeScript would throw an error for
  `console.log(shape.name)`, because this value can't safely be read on an
  unbounded shape of type `T`.
- If we'd not chosen `T` for our generic type, and instead used `Shape`
  directly; `changeColour(shape: Shape, colour: string): Shape {...`, we would
  lose the type information after mapping `colour` to the object: `redSquare`
  would be of type `Shape`, not `Square`.
