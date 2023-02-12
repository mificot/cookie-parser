# Cookies

Cookies is a set of utilities that you'll need to work with cookie.
Features:
- Written in typescript
- Simple and fast cookies parser
- Simple cookie serializer
- Cookie signer to protect your cookie

Project mostly inspired by [cookie](https://www.npmjs.com/package/cookie) module

## Installation

To start using package you need to run following commands via NPM:

```bash
  npm install @mificot/cookies
```

That it. Now you ready to go 😊

## Usage/Examples

### Basic example (parse)

```typescript
import { parse } from '@mificot/cookies'

const cookies = parse('foo=bar; equation=E%3Dmc%5E2');
// { foo: 'bar', equation: 'E=mc^2' }
```

### Basic example (serialize)

```typescript
import { serialize } from '@mificot/cookies'

const cookie = serialize('foo', 'bar');
// foo=bar
```