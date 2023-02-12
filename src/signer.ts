import { createHmac, timingSafeEqual } from 'node:crypto'
import { type Signer } from './interfaces/signer.interface.js'

const HASH_DELIMITER = '.'

function createSign (value: string, secret: string): Buffer {
  return createHmac('sha256', secret).update(value).digest()
}

function sign (value: string, secret: string): string {
  const hash = createSign(value, secret).toString('hex')
  return `${value}${HASH_DELIMITER}${hash}`
}

function unsign (cookie: string, secret: string): string {
  const [cookieValue, cookieSign] = cookie.split(HASH_DELIMITER)

  if (!cookieValue || !cookieSign) {
    throw new Error('Malformed cookie')
  }

  const signedCookieValueBuffer = createSign(cookieValue, secret)
  const cookieSignBuffer = Buffer.from(cookieSign, 'hex')

  if (
    signedCookieValueBuffer.length !== cookieSignBuffer.length ||
    !timingSafeEqual(signedCookieValueBuffer, cookieSignBuffer)
  ) {
    throw new Error('Malformed cookie')
  }

  return cookieValue
}

export function createSigner (secret: string): Signer {
  return {
    sign: (value: string) => sign(value, secret),
    unsign: (value: string) => unsign(value, secret)
  }
}
