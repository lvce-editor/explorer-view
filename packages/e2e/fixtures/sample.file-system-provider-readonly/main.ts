import type { FileSystemProvider } from '@lvce-editor/api'

// Import at runtime so Firefox can load the API in the isolated extension worker.
const { activate: activateExtensionApi, registerFileSystemProvider } = await import('@lvce-editor/api')

const contents = Object.create(null) as Record<string, string>

const fileSystemProvider: FileSystemProvider = {
  id: 'readonly',
  isReadonly() {
    return true
  },
  readDirWithFileTypes(_uri) {
    return [{ name: 'file.txt', type: 7 }]
  },
  readFile(uri) {
    return contents[uri]
  },
  writeFile(uri, content) {
    contents[uri] = content
  },
}
await activateExtensionApi()
registerFileSystemProvider(fileSystemProvider)
