import type { FileSystemProvider, SourceControlProvider } from '@lvce-editor/api'

// Import at runtime so Firefox can load the API in the isolated extension worker.
const { activate: activateExtensionApi, registerFileSystemProvider, registerSourceControlProvider } = await import('@lvce-editor/api')

const contents = Object.create(null) as Record<string, string>
contents['/a'] = ''
contents['/b'] = ''

const normalize = (uri: string): string => uri.replace('extension-host://xyz://', '')

const fileSystemProvider: FileSystemProvider = {
  id: 'xyz',
  writeFile(uri, content) {
    contents[normalize(uri)] = content
  },
  mkdir(uri) {
    contents[normalize(uri)] = ''
  },
  rename(_oldUri, _newUri) {},
  readFile(uri) {
    return contents[normalize(uri)] ?? ''
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
  getFileDecorations(uris) {
    const filtered = uris.filter((uri) => uri.endsWith('a'))
    const decorations = filtered.map((item) => {
      return {
        decoration: 'ignored',
        uri: item,
      }
    })
    return decorations
  },
  isActive() {
    return true
  },
}
await activateExtensionApi()
registerFileSystemProvider(fileSystemProvider)
registerSourceControlProvider(sourceControlProvider)
