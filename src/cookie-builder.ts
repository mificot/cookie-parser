// eslint-disable-next-line no-control-regex
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/

export type SameSite = 'Strict' | 'Lax' | 'None'

export class CookieBuilder {
  private value: string | null = null
  private name: string | null = null
  private domain: string | null = null
  private expires: string | null = null
  private httpOnly: boolean | null = null
  private maxAge: number | null = null
  private path: string | null = null
  private sameSite: SameSite | null = null
  private secure: boolean | null = null

  private assertFieldContent (content: string, parameterName: string): void {
    if (!fieldContentRegExp.test(content)) {
      throw new Error(`${parameterName} is invalid. Refer to RFC 7230 sec 3.2`)
    }
  }

  public setName (name: string): CookieBuilder {
    this.assertFieldContent(name, 'name')
    this.name = name
    return this
  }

  public setValue (value: string): CookieBuilder {
    this.assertFieldContent(value, 'value')
    this.value = value
    return this
  }

  public setDomain (domain: string): CookieBuilder {
    this.assertFieldContent(domain, 'domain')
    this.domain = domain
    return this
  }

  public setExpires (expires: string | Date | number): CookieBuilder {
    if (typeof expires === 'string' || typeof expires === 'number') {
      this.expires = new Date(expires).toISOString()
    } else {
      this.expires = expires.toISOString()
    }
    return this
  }

  public setHttpOnly (): CookieBuilder {
    this.httpOnly = true
    return this
  }

  public setMaxAge (maxAge: number): CookieBuilder {
    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError('maxAge must be valid number')
    }
    this.maxAge = Math.floor(maxAge)
    return this
  }

  public setPath (path: string): CookieBuilder {
    this.assertFieldContent(path, 'path')
    this.path = path
    return this
  }

  public setSameSite (sameSite: SameSite): CookieBuilder {
    switch (sameSite) {
      case 'Strict':
      case 'Lax':
      case 'None':
        this.sameSite = sameSite
        break
      default:
        throw new Error('Invalid SameSite value')
    }

    return this
  }

  public setSecure (): CookieBuilder {
    this.secure = true
    return this
  }

  public build (): string {
    if (this.name === null || this.value === null) {
      throw new Error('Cookie must have both name and value')
    }

    const cookieParts = [`${this.name}=${this.value}`]

    this.domain && cookieParts.push(`Domain=${this.domain}`)
    this.expires && cookieParts.push(`Expires=${this.expires}`)
    this.httpOnly && cookieParts.push('HttpOnly')
    this.maxAge && cookieParts.push(`MaxAge=${this.maxAge}`)
    this.path && cookieParts.push(`Path=${this.path}`)
    this.sameSite && cookieParts.push(`SameSite=${this.sameSite}`)
    this.secure && cookieParts.push('Secure')

    return cookieParts.join('; ')
  }
}
