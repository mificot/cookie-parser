import { serialize } from '../serializer.js'

const INVALID_FIELD_CONTENT_ERROR_REGEXP = /is invalid. Refer to RFC/

describe('serialize without options', () => {
  it('should serialize name=value', () => {
    expect(serialize('foo', 'bar')).toBe('foo=bar')
  })

  it('should encode value', () => {
    expect(serialize('foo', 'bar+buzz')).toBe('foo=bar%2Bbuzz')
  })

  it('should throw when pass invalid name', () => {
    expect(() => serialize('foo\n', 'bar')).toThrow(INVALID_FIELD_CONTENT_ERROR_REGEXP)
    expect(() => serialize('foo\0', 'bar')).toThrow(INVALID_FIELD_CONTENT_ERROR_REGEXP)
  })
})

describe('serialize with options', () => {
  describe('serialize with "domain" option', () => {
    it('should serialize "domain" correctly', () => {
      expect(serialize('foo', 'bar', { domain: 'example.com' })).toBe('foo=bar; Domain=example.com')
    })

    it('should throw when pass invalid "domain"', () => {
      expect(() => serialize('foo', 'bar', { domain: 'example.com\0' })).toThrow(INVALID_FIELD_CONTENT_ERROR_REGEXP)
    })
  })

  describe('serialize with "path" option', () => {
    it('should serialize "path" correctly', () => {
      expect(serialize('foo', 'bar', { path: '/' })).toBe('foo=bar; Path=/')
    })

    it('should throw when pass invalid "path"', () => {
      expect(() => serialize('foo', 'bar', { path: '/\n\0' })).toThrow(INVALID_FIELD_CONTENT_ERROR_REGEXP)
    })
  })

  describe('serialize with "secure" option', () => {
    it('should serialize "secure" correctly', () => {
      expect(serialize('foo', 'bar', { secure: true })).toBe('foo=bar; Secure')
    })

    it('should not serialize "secure" when secure=false', () => {
      expect(serialize('foo', 'bar', { secure: false })).toBe('foo=bar')
    })
  })

  describe('serialize with "httpOnly" option', () => {
    it('should serialize "httpOnly" correctly', () => {
      expect(serialize('foo', 'bar', { httpOnly: true })).toBe('foo=bar; HttpOnly')
    })

    it('should not serialize "httpOnly" when httpOnly=false', () => {
      expect(serialize('foo', 'bar', { httpOnly: false })).toBe('foo=bar')
    })
  })

  describe('serialize with "sameSite" option', () => {
    it('should serialize "sameSite" Strict correctly', () => {
      expect(serialize('foo', 'bar', { sameSite: 'Strict' })).toBe('foo=bar; SameSite=Strict')
    })

    it('should serialize "sameSite" Lax correctly', () => {
      expect(serialize('foo', 'bar', { sameSite: 'Lax' })).toBe('foo=bar; SameSite=Lax')
    })

    it('should serialize "sameSite" None correctly', () => {
      expect(serialize('foo', 'bar', { sameSite: 'None' })).toBe('foo=bar; SameSite=None')
    })

    it('should throw when "sameSite" is incorrect', () => {
      expect(() => serialize('foo', ' bar', { sameSite: '1' as any })).toThrow(/Invalid SameSite value/)
    })
  })

  describe('serialize with "expires" option', () => {
    it('should serialize "expires" number value correctly', () => {
      const expires = Date.now()
      const expected = new Date(expires).toISOString()

      expect(serialize('foo', 'bar', { expires })).toBe(`foo=bar; Expires=${expected}`)
    })

    it('should serialize "expires" string value correctly', () => {
      const expires = new Date().toISOString()

      expect(serialize('foo', 'bar', { expires })).toBe(`foo=bar; Expires=${expires}`)
    })

    it('should serialize "expires" Date value correctly', () => {
      const expires = new Date()
      const expected = expires.toISOString()

      expect(serialize('foo', 'bar', { expires })).toBe(`foo=bar; Expires=${expected}`)
    })
  })

  describe('serialize with "maxAge" option', () => {
    it('should serialize "maxAge" correctly', () => {
      const maxAge = 1000

      expect(serialize('foo', 'bar', { maxAge })).toBe(`foo=bar; MaxAge=${maxAge}`)
    })

    it('should throw if "maxAge" in not a number', () => {
      const maxAge = 'foo' as any

      expect(() => serialize('foo', 'bar', { maxAge })).toThrow(/maxAge must be valid number/)
    })

    it('should throw if "maxAge" Infinity', () => {
      const maxAge = Infinity

      expect(() => serialize('foo', 'bar', { maxAge })).toThrow(/maxAge must be valid number/)
    })

    it('should floor "maxAge" to integer value', () => {
      const maxAge = 1000.123
      const expected = 1000

      expect(serialize('foo', 'bar', { maxAge })).toBe(`foo=bar; MaxAge=${expected}`)
    })
  })
})
