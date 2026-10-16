import type { FileSystemProvider } from '@lvce-editor/api'

// Import at runtime so Firefox can load the API in the isolated extension worker.
const { activate: activateExtensionApi, registerFileSystemProvider } = await import('@lvce-editor/api')

const contents = Object.create(null) as Record<string, string>

class FileNotFoundError extends Error {
  readonly code = 'ENOENT'

  constructor(_uri: string) {
    super(`File not found`)
    this.name = 'FileNotFoundError'
  }
}

const fileSystemProvider: FileSystemProvider = {
  id: 'xyz',
  writeFile(uri, content) {
    contents[uri] = content
  },
  rename(_oldUri, _newUri) {},
  readFile(uri) {
    return contents[uri]
  },
  readDirWithFileTypes(_uri) {
    throw new FileNotFoundError(_uri)
  },
  remove(_uri) {
    throw new Error(`oops`)
  },
}
await activateExtensionApi()
registerFileSystemProvider(fileSystemProvider)
