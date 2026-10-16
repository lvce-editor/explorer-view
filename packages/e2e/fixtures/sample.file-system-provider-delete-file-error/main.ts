import type { FileSystemProvider } from '@lvce-editor/api'

// Import at runtime so Firefox can load the API in the isolated extension worker.
const { activate: activateExtensionApi, registerFileSystemProvider } = await import('@lvce-editor/api')

const contents = Object.create(null) as Record<string, string>

const fileSystemProvider: FileSystemProvider = {
  id: 'xyz',
  writeFile(uri, content) {
    contents[uri] = content
  },
  rename(_oldUri, _newUri) {},
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
  remove(_uri) {
    throw new Error(`oops`)
  },
}
await activateExtensionApi()
registerFileSystemProvider(fileSystemProvider)
