import { parse } from '../parser.js'

function createMapFromObject (object: Record<string, string>): Map<string, string> {
  return new Map<string, string>(Object.entries(object))
}

describe('parser', function () {
  it('should throw with no input', () => {
    expect(() => {
      // @ts-expect-error let's imagine here that we are using js
      parse()
    }).toThrow()
  })

  it('should throw when input not a string', () => {
    expect(() => {
      // @ts-expect-error let's imagine here that we are using js
      parse(0)
    }).toThrow()
  })

  it('should parse string to object', () => {
    expect(parse('foo=bar')).toStrictEqual(createMapFromObject({ foo: 'bar' }))
    expect(parse('baz=1')).toStrictEqual(createMapFromObject({ baz: '1' }))
    expect(parse('foo=bar;baz=1')).toStrictEqual(createMapFromObject({ foo: 'bar', baz: '1' }))
    expect(parse('foo=bar;baz=1;buzz=2')).toStrictEqual(createMapFromObject({ foo: 'bar', baz: '1', buzz: '2' }))
    expect(parse('foo=bar;baz=1;buzz=2;foobarbuzz=3')).toStrictEqual(createMapFromObject({ foo: 'bar', baz: '1', buzz: '2', foobarbuzz: '3' }))
  })

  it('should ignore optional whitespaces', () => {
    expect(parse('foo  =  bar;   baz = 1')).toStrictEqual(createMapFromObject({
      foo: 'bar',
      baz: '1'
    }))
  })

  it('should parse cookie with empty value', () => {
    expect(parse('foo= ; bar=')).toStrictEqual(createMapFromObject({ foo: '', bar: '' }))
  })

  it('should decode uri values', () => {
    expect(parse('foo=%20%40%23%24%25%5E%26%3A%22%2f')).toStrictEqual(createMapFromObject({
      foo: ' @#$%^&:"/'
    }))
    expect(parse('foo=hello%20there!')).toStrictEqual(createMapFromObject({
      foo: 'hello there!'
    }))
    expect(parse('foo=bar; equation=E%3Dmc%5E2')).toStrictEqual(createMapFromObject({ foo: 'bar', equation: 'E=mc^2' }))
  })

  it('should return original value if decode failed', () => {
    expect(parse('foo=%A; bar=foo')).toStrictEqual(createMapFromObject({
      foo: '%A',
      bar: 'foo'
    }))
  })

  it('should ignore pairs without value', () => {
    expect(parse('foo=bar;fizz   ;   buzz')).toStrictEqual(createMapFromObject({
      foo: 'bar'
    }))

    expect(parse('  fizz; foo=  bar')).toStrictEqual(createMapFromObject({ foo: 'bar' }))
  })

  it('should ignore duplicate cookies keys', () => {
    expect(parse('foo=%1;bar=bar;foo=boo')).toStrictEqual(createMapFromObject({ foo: '%1', bar: 'bar' }))
    expect(parse('foo=false;bar=bar;foo=true')).toStrictEqual(createMapFromObject({ foo: 'false', bar: 'bar' }))
    expect(parse('foo=;bar=bar;foo=boo')).toStrictEqual(createMapFromObject({ foo: '', bar: 'bar' }))
  })
})
