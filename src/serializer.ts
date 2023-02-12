import { CookieBuilder, type SameSite } from './cookie-builder.js'

interface SerializeOptions {
  domain?: string
  expires?: Date | number | string
  httpOnly?: boolean
  maxAge?: number
  path?: string
  sameSite?: SameSite
  secure?: boolean
  encode?: (value: string) => string
}

function assertNameType (name: any): void {
  if (!name || typeof name !== 'string') {
    throw new Error('name is required and must be a string')
  }
}

function assertValueType (value: any): void {
  if (value === null || value === undefined || typeof value !== 'string') {
    throw new Error('value is required and must be a string')
  }
}

export function serialize (name: string, value: string, options?: SerializeOptions): string {
  assertNameType(name)
  assertValueType(value)

  options = options ?? {}

  if (!options.encode) {
    options.encode = encodeURIComponent
  }

  value = options.encode(value)

  const cookieBuilder = new CookieBuilder()

  cookieBuilder.setName(name).setValue(value)

  options.domain && cookieBuilder.setDomain(options.domain)
  options.expires && cookieBuilder.setExpires(options.expires)
  options.maxAge && cookieBuilder.setMaxAge(options.maxAge)
  options.path && cookieBuilder.setPath(options.path)
  options.secure && cookieBuilder.setSecure()
  options.httpOnly && cookieBuilder.setHttpOnly()
  options.sameSite && cookieBuilder.setSameSite(options.sameSite)

  return cookieBuilder.build()
}
