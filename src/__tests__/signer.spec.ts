import { createSigner } from '../signer.js'

describe('signer', () => {
  describe('signer.sign', () => {
    it('should correctly calculate sha256 HMAC', () => {
      const value = 'mificot'
      const secret = 'secretKey'
      const expected = 'mificot.91be1aa5bb7b88e639ce5b025cf08592945cc34508aeafb8d01f7ba497490d1b'
      expect(createSigner(secret).sign(value)).toBe(expected)
    })

    it('should correctly calculate sha256 HMAC with different keys', () => {
      const value1 = 'mificot'
      const secret1 = 'secretKey1'
      const signed1 = createSigner(secret1).sign(value1)

      const value2 = 'mificot'
      const secret2 = 'secretKey2'
      const signed2 = createSigner(secret2).sign(value2)

      expect(signed1).not.toBe(signed2)
    })
  })

  describe('signer.unsign', () => {
    it('should unsing cookie value', () => {
      const cookie = 'mificot.91be1aa5bb7b88e639ce5b025cf08592945cc34508aeafb8d01f7ba497490d1b'
      const expected = 'mificot'
      const secret = 'secretKey'
      expect(createSigner(secret).unsign(cookie)).toBe(expected)
    })

    it('should throw when using cookie with different key', () => {
      const cookie = 'mificot.91be1aa5bb7b88e639ce5b025cf08592945cc34508aeafb8d01f7ba497490d1b'
      const secret = 'secretKey2'
      expect(() => createSigner(secret).unsign(cookie)).toThrow(/Malformed cookie/)
    })

    it('should throw when modify actual value', () => {
      const cookie = 'mificot2.91be1aa5bb7b88e639ce5b025cf08592945cc34508aeafb8d01f7ba497490d1b'
      const secret = 'secretKey'
      expect(() => createSigner(secret).unsign(cookie)).toThrow(/Malformed cookie/)
    })

    it('should throw when modify hash', () => {
      const cookie = 'mificot.91be1aa5bb7b88e639ce5b025cf08592945cc34508aeafb8d01f7ba4974aaaaa'
      const secret = 'secretKey'
      expect(() => createSigner(secret).unsign(cookie)).toThrow(/Malformed cookie/)
    })

    it('should throw on invalid cookie value', () => {
      const cookie = 'mificot'
      const secret = 'secretKey'
      expect(() => createSigner(secret).unsign(cookie)).toThrow(/Malformed cookie/)
    })
  })
})
