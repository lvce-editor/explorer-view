export const getDisplayUri = (uri: string): string => {
  if (!uri.startsWith('remote-server://')) {
    return uri
  }
  if (!URL.canParse(uri)) {
    return uri
  }
  const parsedUri = new URL(uri)
  if (parsedUri.protocol !== 'remote-server:' || !parsedUri.hostname || !parsedUri.pathname.startsWith('/')) {
    return uri
  }
  return parsedUri.pathname
}
