import { activate as activateExtensionApi, registerFileSystemProvider, type FileSystemProvider } from '@lvce-editor/api'

const contents = Object.create(null) as Record<string, string>

const fileSystemProvider: FileSystemProvider = {
  id: 'xyz',
  writeFile(uri, content) {
    contents[uri] = content
    if (uri.endsWith('/file4.txt')) {
      throw new Error(`Permission Denied`)
    }
  },
  rename(_oldUri, _newUri) {
    throw new Error(`Permission Denied`)
  },
  readFile(uri) {
    return contents[uri] ?? ''
  },
  readDirWithFileTypes(uri) {
    const results = []
    for (const key of Object.keys(contents)) {
      if (key.startsWith(uri)) {
        results.push({
          type: 7,
          name: key.slice(key.lastIndexOf('/')),
        })
      }
    }
    return results
  },
}
await activateExtensionApi()
registerFileSystemProvider(fileSystemProvider)
