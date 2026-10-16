import type { FileSystemProvider, SourceControlProvider } from '@lvce-editor/api'

// Import at runtime so Firefox can load the API in the isolated extension worker.
const { activate: activateExtensionApi, registerFileSystemProvider, registerSourceControlProvider } = await import('@lvce-editor/api')

const contents = Object.create(null) as Record<string, string>

const fileSystemProvider: FileSystemProvider = {
  id: 'xyz',
  writeFile(uri, content) {
    contents[uri] = content
  },
  mkdir(uri) {
    contents[uri] = ''
  },
  rename(_oldUri, _newUri) {},
  readFile(uri) {
    return contents[uri] ?? ''
  },
  readDirWithFileTypes(_uri) {
    return [
      { type: 7, name: 'a' },
      { type: 7, name: 'b' },
    ]
  },
}

const sourceControlProvider: SourceControlProvider = {
  id: 'xyz',
  getChangedFiles() {
    return []
  },
  getBadgeCount() {
    return 0
  },
  getFileDecorations(_uris) {
    // Deliberately malformed response: verify Explorer ignores null decorations.
    return null
  },
  isActive() {
    return true
  },
}
await activateExtensionApi()
registerFileSystemProvider(fileSystemProvider)
registerSourceControlProvider(sourceControlProvider)
