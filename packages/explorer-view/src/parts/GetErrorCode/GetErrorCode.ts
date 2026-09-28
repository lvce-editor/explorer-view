export const getErrorCode = (error: unknown): string => {
  const seen = new Set<unknown>()
  while (error && typeof error === 'object' && !seen.has(error)) {
    seen.add(error)
    if ('code' in error && ((typeof error.code === 'string' && error.code) || typeof error.code === 'number')) {
      return String(error.code)
    }
    error = 'cause' in error ? error.cause : undefined
  }
  return ''
}
