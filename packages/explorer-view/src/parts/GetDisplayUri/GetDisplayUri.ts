export const getDisplayUri = (uri: string): string => {
  if (!uri.startsWith('remote-server://')) {
    return uri
  }
  try {
    const parsedUri = new URL(uri)
    if (parsedUri.protocol !== 'remote-server:' || !parsedUri.hostname || !parsedUri.pathname.startsWith('/')) {
      return uri
    }
    return parsedUri.pathname
  } catch {
    return uri
  }
}
