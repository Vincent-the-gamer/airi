/**
 * A type predicate that is true if the given value is either undefined
 * or null.
 */
export function isNullOrUndefined<T>(
  value: T | null | undefined,
): value is null | undefined {
  return <T>value === null || <T>value === undefined
}

/**
 * A type predicate that is true if the given value is neither undefined
 * nor null.
 */
export function notNullOrUndefined<T>(
  value: T | null | undefined,
): value is T {
  return <T>value !== null && <T>value !== undefined
}

export async function getEnvironment() {
  if (typeof window !== 'undefined' && window !== null) {
    return 'browser'
  }

  try {
    const process = await import('node:process')
    if (typeof process !== 'undefined'
      && process.versions != null
      && process.versions.node != null) {
      return 'node'
    }

    return 'unknown'
  }
  catch {
    return 'unknown'
  }
}
