export const getErrorCode = (error: unknown): string => {
  const seen = new Set<unknown>()
  while (error && typeof error === 'object' && !seen.has(error)) {
    seen.add(error)
    // The RPC transport's generic custom-error code does not identify the
    // filesystem failure. Prefer a cause's code or the caller's fallback.
    if ('code' in error && error.code !== -32_001 && ((typeof error.code === 'string' && error.code) || typeof error.code === 'number')) {
      return String(error.code)
    }
    error = 'cause' in error ? error.cause : undefined
  }
  return ''
}
