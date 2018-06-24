# Namespace: `browser.foo`

Example interface schema to demonstrate webext-experiment-utils

## Functions

### `browser.foo.doSomething( payload )`

Do something with the given payload.

**Parameters**

- `payload`
  - type: payload
  - $ref:
  - optional: false

## Events

### `browser.foo.onFoo ()` Event

Fires when deemed appropriate

**Parameters**

- `fooInfo`
  - type: fooInfo
  - $ref:
  - optional: false

## Properties TBD

## Data Types

### [0] AnyObject

```json
{
  "id": "AnyObject",
  "$schema": "http://json-schema.org/draft-04/schema",
  "type": "object",
  "additionalProperties": true,
  "testcase": {
    "foo": "bar"
  }
}
```

# Namespace: `browser.fooDebug`

Example interface schema secondary namespace

## Functions

### `browser.fooDebug.reset( )`

Reset the foo internal state, for debugging purposes.

**Parameters**

## Events

(None)

## Properties TBD

## Data Types

(None)
