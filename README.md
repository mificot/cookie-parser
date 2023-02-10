# Cookie Parser

This is **yet another** cookie parser but written in typescript.
Project mostly inspired by [cookie](https://www.npmjs.com/package/cookie) module


## Installation

To start using package you need to run following commands via NPM:

```bash
  npm install @mificot/cookie-parser
```

That it. Now you ready to go 😊

## Usage/Examples
### Basic example
```typescript
import { parse } from '@mificot/cookie-parser'

const cookies = parse('foo=bar; equation=E%3Dmc%5E2');
// { foo: 'bar', equation: 'E=mc^2' }
```

## Todo
- [ ] Add an option to add custom "converter" to convert values on the fly (ex. to numbers or parse JSON)
