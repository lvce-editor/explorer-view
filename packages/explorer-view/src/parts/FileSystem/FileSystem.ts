export const readFile = async (uri, encoding = EncodingType.Utf8) => {}

export const readJson = async (uri, encoding) => {}

export const remove = async (uri) => {}

export const rename = async (oldUri, newUri) => {}

export const mkdir = async (uri) => {}

export const writeFile = async (uri, content, encoding) => {}

export const createFile = (uri) => {}

export const readDirWithFileTypes = async (uri) => {}

export const unwatch = (id) => {
  throw new Error('not implemented')
}

export const unwatchAll = () => {
  throw new Error('not implemented')
}

export const getBlobUrl = async (uri) => {}

export const getBlob = async (uri) => {}

export const copy = async (sourceUri, targetUri) => {}

export const getPathSeparator = async (uri) => {}

export const getRealPath = async (uri) => {}

export const stat = async (uri) => {}

export const chmod = async (uri, permissions) => {}

export const canBeRestored = async (uri) => {}
