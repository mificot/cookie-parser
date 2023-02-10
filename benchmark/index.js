import benchmark from 'benchmark'
import { parse } from '../dist/esm/index.js'

const suite = new benchmark.Suite({
  minSamples: 500
})

const duplicates = `${generateCookie(2)}; ${generateCookie(2)}`
const tenCookies = generateCookie(10)
const hundredCookies = generateCookie(100)

function generateCookie (count) {
  return new Array(count).fill('foo').map((key, index) => `${key}${index}=${key}`).join(';')
}

suite
  .add('parse("foo=bar")', () => {
    parse('foo=bar')
  })
  .add('parse("foo=hello%20there!")', () => {
    parse('foo=hello%20there!')
  })
  .add(`parse("${duplicates}")`, () => {
    parse(duplicates)
  })
  .add('parse(10 cookies)', () => {
    parse(tenCookies)
  })
  .add('parse(100 cookies)', () => {
    parse(hundredCookies)
  })
  .on('cycle', (event) => {
    console.log(String(event.target))
  })
  .run({ async: false })
