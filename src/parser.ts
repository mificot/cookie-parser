/**
 * This method asserts input type, because lib can be used in js environment or in IDE which
 * do not support typescript declarations
 */
function assertInputType (input: any): void {
  if (typeof input !== 'string') {
    throw new TypeError('input parameter must be a string')
  }
}

function decode (input: string): string {
  if (!input.includes('%')) {
    return input
  }

  try {
    return decodeURIComponent(input)
  } catch {
    return input
  }
}

export function parse (input: string): Map<string, string> {
  assertInputType(input)

  const result: Map<string, string> = new Map<string, string>()

  let cursor = 0

  while (cursor < input.length) {
    /**
     * Skip all optional spaces before key
     */
    if (input[cursor] === ' ') {
      cursor += 1
      continue
    }

    const equalSignIndex = input.indexOf('=', cursor)

    /**
     * No left `key=value` pairs
     */
    if (equalSignIndex < 0) {
      return result
    }

    let separatorIndex = input.indexOf(';', cursor)

    /**
     * If we didn't find a ";" then the "separator" index will be at the end of input
     */
    if (separatorIndex < 0) {
      separatorIndex = input.length
    }

    if (equalSignIndex > separatorIndex) {
      cursor = separatorIndex + 1
      continue
    }

    const key = input.slice(cursor, equalSignIndex).trimEnd()

    if (!result.has(key)) {
      const value = input.slice(equalSignIndex + 1, separatorIndex).trim()
      result.set(key, decode(value))
    }

    cursor = separatorIndex + 1
  }

  return result
}
