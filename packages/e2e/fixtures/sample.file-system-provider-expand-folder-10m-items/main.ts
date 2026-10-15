import type { FileSystemProvider } from '@lvce-editor/api'

// Import at runtime so Firefox can load the API in the isolated extension worker.
const { activate: activateExtensionApi, registerFileSystemProvider } = await import('@lvce-editor/api')

const rootUri = 'extension-host://xyz://'
const folderUri = `${rootUri}stress-folder`
const folderEntry = {
  type: 2,
  name: 'stress-folder',
}
const totalItems = 10_000_000

const fileSystemProvider: FileSystemProvider = {
  id: 'xyz',
  rename() {},
  readFile() {
    return ''
  },
  writeFile() {},
  readDirWithFileTypes(uri) {
    if (uri === rootUri) {
      return [folderEntry]
    }
    if (uri === folderUri) {
      return Array.from({ length: totalItems }, (_, index) => {
        return {
          type: 1,
          name: `item-${index.toString().padStart(8, '0')}.txt`,
        }
      })
    }
    return []
  },
}

await activateExtensionApi()
registerFileSystemProvider(fileSystemProvider)
