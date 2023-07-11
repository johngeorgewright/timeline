# @johngw/timeline

> Parse a stream-like timeline of values.

A timeline is the way to describe and test values over a period of time. For example, consider the following:

```
--1--2--3--4--
```

The above is a stream-like set of values that queues 1, 2, 3, 4.

The following is an example of merging 2 streams together and what the result would be after.

```
merge([
--1---2---3---4--
----a---b---c----
])

--1-a-2-b-3-c-4--
```

## Use

Use the `Timeline` class to generate an `AsncyIterator` of timeline values.

```javascript
const timeline = new Timeline(`
  --1--{foo: bar}--[a,b]--true--T--false--F--null--N--E--E(err foo)--T10--X-|
`)

for await (const value of timeline) {
  // Customise the handling of your values here
}
```

## Examples

See real-world examples in the `@johngw/stream-test` package:

- https://github.com/johngeorgewright/stream/blob/main/packages/stream-test/src/fromTimeline.ts
- https://github.com/johngeorgewright/stream/blob/main/packages/stream-test/src/expectTimeline.ts

## Syntax

The syntax for timelines are as follows:

### Closing a stream

A stream will only close, when specified to do so, with the pipe character: `|`.

For example:

```
--1--2--3--4--|
```

### Errors

An error can be populated downstream with the capital letter `E` and an optional message inside paranthesis: `E(my message)`.

### Never

Sometimes you may want to create an expectation that the timeline should **never** reach. Use the capital `X` for such a scenario.

For example, the `buffer` transformer's test uses this to test that the buffer's `notifier` close event will close the source stream:

```
--1--2--3---X

buffer(
--------|
)

--------[1,2,3]
```

### Timers

To signal waiting for a period of milliseconds, use a capital `T` followed by a number, representing the amount of `milliseconds` to wait for.

For example:

```
--1--2------

debounce(10)

-----T10-2--
```

### Null

Although the keyword `null` can be used, a shorter `N` can also be used.

### Booleans

Althought the keywords `true` & `false` can be used, the shorter versions `T` & `F` can also be used.

### Numbers, Strings, Boolean, Objects & Arrays

Any combination of characters, other than a dash (`-`) or any of the above syntax, will be parsed by [js-yaml](https://github.com/nodeca/js-yaml).
