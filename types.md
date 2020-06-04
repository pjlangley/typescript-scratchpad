# Types and terminology of patterns

## Unknown

Like `any`, `unknown` represents any value, but TypeScript won't let you use an
`unknown` type until you refine it by checking what it is.

Here are some things you can do:

```ts
let a: unknown = 30; // unknown
let b = a === 123; // boolean
let c = a + 10; // Error TS2571: Object is of type 'unknown'.
if (typeof a === "number") {
  let d = a + 10; // number
}
```

- TS will never infer something as unknown; it must be explicit.
- You can compare values to values that are of type `unknown`.
- You can't do things that assume an `unknown` value is of a specific type; you
  have to prove to TS that the value really is of that type first.

## Type literals

For example, you can type a `boolean` as a literal value:

```ts
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

```ts
let cinemaSeatAssignment: {
  [seatNumber: string]: string;
} = {
  "11a": "Peter",
  "11b": "Paul",
};
```

## Union types

I.e. everything in A, or B, or both.

```ts
type YesOrNo = "yes" | "no";
```

A value with a union type isn't necessarily one specific member of the union: it
can be multiple members at once.

```ts
type Cat = { name: string; purrs: boolean };
type Dog = { name: string; barks: boolean };
type CatOrDogOrBoth = Cat | Dog;

let notACat: CatOrDogOrBoth = {
  name: "Kitty",
  purrs: true,
  barks: true,
};
```

This cat can both _purr_ and _bark_.

### Unique union types

Given that we've seen a cat can both purr and bark with a union type, there's a conventional
way to let TS know which type it is, when necessary, and that's to add a `type` prop:

```ts
type Cat = { type: 'cat', name: string; purrs: boolean };
type Dog = { type: 'dog', name: string; barks: boolean };
type CatOrDogOrBoth = Cat | Dog;

function handlePet(pet: CatOrDogOrBoth) {
  if (pet.type === 'cat') {
    console.info(pet.barks);
  }
}
```

Within the `if` statement, TS throws the following error, as it was able to infer the type was a `Cat`:

```
Property 'barks' does not exist on type 'Cat'. ts(2339)
```

## Intersection types

I.e. everything in both A and B.

```ts
type Cat = { name: string; purrs: boolean };
type Dog = { name: string; barks: boolean };
type CatAndDog = Cat & Dog;

let superCat: CatAndDog = {
  name: "Kitty",
  purrs: true,
  barks: true,
};
```

## Tuples

Tuples are subtypes of `array`. They're a special way to type arrays that have
fixed lengths, where the values at each index have specific known types.

```ts
let a: [number] = [1];
let b: [string, string, number] = ["peter", "paul", 1987];
let trainFares: [number, number?][] = [[5.77], [4.49, 2.28]];
let friends: [string, ...string[]];
```

## Enums

Not as safe as you may expect:

```ts
enum Flippable {
  Burger,
  Pancake,
  Plate,
}

function flip(f: Flippable) {
  return "flipped it";
}

flip(Flippable.Burger);
flip(Flippable.Pancake);
flip(3);
let a: Flippable = 8;
```

A safer approach is to avoid numeric values:

```ts
enum Flippable {
  Burger = "Burger",
  Pancake = "Pancake",
  Plate = "Plate",
}

let a: Flippable = 8; // Type '8' is not assignable to type 'Flippable'. ts(2322)
```

## Iterable & Iterator

Any object that contains a property called `Symbol.iterator`, whose value is a
function that returns an iterator.

```ts
let numbers = {
  *[Symbol.iterator]() {
    for (let n = 1; n <= 10; n++) {
      yield n;
    }
  },
};
```

## Functions

```ts
type Sum = (a: number, b: number) => number;

const sum: Sum = (a, b) => {
  return a + b;
};
```

Declaring a callback parameter:

```ts
function log(message: string, f: (error: boolean) => void) {
  console.log("Hello");
  f(false);
}
```

Typing a function with a property:

```ts
type WarnUser = {
  (warning: string): void;
  wasCalled: boolean;
};

const warnUser: WarnUser = (warning) => {
  if (warnUser.wasCalled) {
    return;
  }

  warnUser.wasCalled = true;
  alert(warning);
};
warnUser.wasCalled = false;
```

## Generics

Filter example:

```ts
type Filter = {
  <T>(array: T[], f: (item: T) => boolean): T[];
};

const filter: Filter = (array, f) => {
  let result = [];
  array.forEach((item) => {
    if (f(item)) {
      result.push(item);
    }
  });
  return result;
};

let names = ["Peter", "Paul", "Suzy"];
let beginsWithP = filter(names, (name) => name.startsWith("P"));
```

## Generic binding

With this example:

```ts
type Filter = {
  <T>(array: T[], f: (item: T) => boolean): T[];
};
```

Because `<T>` is part of the call signature, right before the signature's
opening parenthesis, `()`, TypeScript will bind a concrete type to `T` when we
actually call a function of type `Filter`.

If we'd instead scoped `T` to the type alias `Filter`, TypeScript would have
required us to bind a type explicitly when we used `Filter`:

```ts
type Filter<T> = {
  (array: T[], f: (item: T) => boolean): T[]
}

const filter: Filter<string> = (array, f) => ...
```

This is called a "full signature call":

```ts
type Filter<T> = {
  (array: T[], f: (item: T) => boolean): T[];
};
```

This equivalent is called a "shorthand signature call":

```ts
type Filter<T> = (array: T[], f: (item: T) => boolean) => T[];
```

### Nested type inference

```ts
type MyEvent<T> = {
  target: T;
  type: string;
};

type ButtonType = MyEvent<HTMLButtonElement>;

type TimedEvent<T> = {
  event: MyEvent<T>;
  from: Date;
  to: Date;
};
```

### Bounded generics

Here's an example:

```ts
type Shape = {
  name: string;
  colour: string;
};

type Square = Shape & {
  sides: 4;
};

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
  sides: 4,
};

const redSquare = changeColour(square, "red"); // type remains Square, not Shape
```

Advantages of binding the generic (`T extends Shape`):

- If it was just typed `T`, TypeScript would throw an error for
  `console.log(shape.name)`, because this value can't safely be read on an
  unbounded shape of type `T`.
- If we'd not chosen `T` for our generic type, and instead used `Shape`
  directly; `changeColour(shape: Shape, colour: string): Shape {...`, we would
  lose the type information after mapping `colour` to the object: `redSquare`
  would be of type `Shape`, not `Square`.

## `type` vs. `interface`

The three subtle differences:

1. Type alias are more general, in that their righthand side can be any type,
   including a type expression, like `&` or `|`. For an interface, the righthand
   side must be a shape. E.g. you can't rewrite the following type aliases as
   interfaces:

```ts
type A = number;
type B = A | string;
```

2. When you extend an interface, TypeScript will make sure that the interface
   you're extending is assignable to your extension. For example:

```ts
interface A {
  good(x: number): string;
  bad(x: number): string;
}

interface B extends A {
  good(x: string | number): string;
  bad(x: string): string;
}
```

`interface B` receives the following error:

```
Interface 'B' incorrectly extends interface 'A'.
  Types of property 'bad' are incompatible.
    Type '(x: string) => string' is not assignable to type '(x: number) => string'.
      Types of parameters 'x' and 'x' are incompatible.
        Type 'number' is not assignable to type 'string'.ts(2430)
```

However, this can be achieved with type aliases:

```ts
type A = {
  good(x: number): string;
  bad(x: number): string;
};

type B = A & {
  good(x: string | number): string;
  bad(x: string): string;
};
```

The extension results in an overloaded signature for `bad`.

When modelling inheritance for object types, the assignability check that
TypeScript does for interfaces can be a helpful tool to catch errors.

3. Multiple interfaces with the same name in the same scope are automatically
   merged; multiple type aliases with the same name in the same scope will throw
   a compile time error. This feature is called **declaration merging**.

## Generic defaults

```ts
type MyEvent<T = HTMLElement> = {
  target: T;
  type: string;
};
```

You can also add bounds to a generic:

```ts
type MyEvent<T extends HTMLElement> = {
  target: T;
  type: string;
};
```

## Classes are structurally typed

```ts
class Zebra {
  trot() {}
}

class Poodle {
  trot() {}
}

function ambleAround(animal: Zebra) {
  animal.trot();
}

let zebra = new Zebra();
let poodle = new Poodle();

ambleAround(zebra); // OK
ambleAround(poodle); // OK
```

This works, because both classes share the same shape, and so it's assignable.

## Typing a class and class constructor

```ts
class SomeClass {
  someProp: number;
  constructor() {}
  someMethod(thing: string): void {}
}

interface SomeClass {
  someProp: number;
  someMethod(thing: string): void;
}

interface SomeClassConstructor {
  new (): SomeClass;
}
```

The `new` part is called a _constructor signature_, and is TypeScript's way of
saying that a given type can be instantiated with the _new_ operator.

## Class polymorphism

Bind class-scoped generic types when declaring your class. Here, `K` and `V`
are available to every instance method and instance property on `MyMap`.

```ts
class MyMap<K, V> {
  constructor(initialKey: K, initialValue: V) {}
  get(key: K) {}
  set(key: K, value: V) {}
  static of<K, V>(k: K, v: V): MyMap<K, V> {}
}
```

Notice that the `static` method doesn't have access to their class generics.
Instead, it declares its own `K` and `V` generics.

## Class Builder Pattern

E.g.:

```ts
new RequestBuilder().setURL("/users").setMethod("get");
```

To type this, we could do the following:

```ts
class RequestBuilder {
  private url: string | null = null;

  setURL(url: string): this {
    this.url = url;
    return this;
  }

  setMethod(method: "get" | "post"): this {
    this.method = method;
  }
}
```

## Covariance

TypeScript shapes (object and classes) are _covariant_ in their property types.
That is, for an object A to be assignable to an object B, each of its properties
must be <: its corresponding property in B.

**Invariance**

You want exactly T.

**Covariance**

You want <:T.

**Contravariance**

You want >:T.

**Bivariance**

You're okay with either <:T or >:T.

In TypeScript; objects, classes, arrays and function return types are covariant.
But function parameters types are contravariant.

For example:

```ts
class Animal {}
class Bird extends Animal {}
class Cros extends Bird {}
```

Crow is a subtype of Bird, which is a subtype of Animal:

```
<: Bird <: Animal
```

## Excess property checking

```ts
type Options = {
  prop: number;
};

type Foo = (options: Options) => void;

const foo: Foo = () => {};

foo({
  prop: 1,
  notTyped: "hi",
  // ^ Object literal may only specify known properties, and 'notTyped' does not exist in type 'Options'.
  // ts(2345)
});

const options = {
  prop: 1,
  notTyped: "hi", // No TS warning...
};

foo(options);
```

TypeScript only performs _excess property checking_ when you try to assign a
fresh object literal type to another type.

A fresh object literal type is the type TypeScript infers from an object
literal. If the object literal either uses a type assertion or is assigned to a
variable, then the fresh object literal type is _widened_ to a regular object
type, and its freshness disappears.

## Key in to a type

```ts
type APIResponse = {
  user: {
    id: string
    friendsList: {
      count: number
    }
  }
}

type userId = APIResponse['user']['id'];
type count = APIResponse['user']['friendsList']['count'];
```

## Key of

```ts
function get<
  O extends object,
  K extends keyof O
>(
  o: O,
  k: K
): O[K] {
  return o[k];
}

const result = get({ a: 'a' }, 'a');
```

- `result` is inferred as type `string`.
- `keyof O` is a union of string literal types, respresenting all of `o`'s keys.

## Mapped type

```ts
type UserAccount = {
  id: number
  isActive: boolean
}

// Make all fields optional
type OptionalUserAccount = {
  [K in keyof UserAccount]?: UserAccount[K]
}

// Equivalent to:
type OptionalUserAccount2 = Partial<UserAccount>;

// Make all fields nullable
type NullableUserAccount = {
  [K in keyof UserAccount]: UserAccount[K] | null
}
```

## Companion Object Pattern

TypeScript types and values live in separate namespaces, which means you can do things like this:

```ts
type Currency = {
  unit: 'GBP' | 'EUR'
  value: number
}

let Currency = {
  DEFAULT: 'GBP',
  from(value: number, unit = Currency.DEFAULT): Currency {
    return { unit, value };
  }
}
```

It also means you can `import` both the type and value too:

```ts
import { Currency } from './Currency';

let amountDue: Currency = {
  unit: 'GBP',
  value: 333,
};
let anotherAmountDue = Currency.from(335, 'EUR');
```

## User Defined Type Guards

```ts
function isString(a: unknown): boolean {
  return typeof a === 'string';
}

function stuff(input: string | number) {
  if (isString(input)) {
    input.toUpperCase();
  }
}
```

We actually see a TS error for the above usage on `toUpperCase`. Although we've implemented
a `typeof` check, this assertion is lost outside of the scope of the `isString` function.

Instead, we can create a _user-defined type guard_ by updating the `isString` method like so:

```ts
function isString(a: unknown): a is string {
  return typeof a === 'string';
}
```

The TS error goes away, because this tells TypeScript that if this returns `true`, not only
is the return a `boolean`, but it's also a type `string`.

## Conditional types

```ts
type A = number | string
type B = string
type C = Exclude<A, B> // number

type D = 'one' | 'two' | 3
type E = Extract<D, string> // "one" | "two"

type F = { a?: number | null }
type G = NonNullable<F> // { a?: number }

type H = (a: number) => string
type I = ReturnType<H> // string

type J = {new(): K}
type K = { b: number }
type L = InstanceType<J> // { b: number }
```

## Non null assertion operator

If you're **sure** something won't be `null`:

```ts
document.querySelector('.thing')!.innerHTML;
```
