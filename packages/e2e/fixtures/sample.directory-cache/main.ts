import type { FileSystemProvider } from '@lvce-editor/api'

const { activate: activateExtensionApi, registerFileSystemProvider } = await import('@lvce-editor/api')
const namespace = crypto.randomUUID()
const contents = new Map<string, string>([['directory-cache://host/workspace/folder/first.txt', 'first']])
let version = 0
let listings = 0
let validations = 0
const normalize = (uri: string): string => uri.replace('extension-host://', '').replace(/\/$/, '')

const provider: FileSystemProvider = {
  getDirectoryVersion(uri) {
    validations++
    return `${namespace}:${normalize(uri)}:${version}`
  },
  id: 'directory-cache',
  readDirWithFileTypes(uri) {
    const path = normalize(uri)
    if (path.endsWith('/workspace')) {
      return [{ name: 'folder', type: 3 }]
    }
    listings++
    return [...contents.keys()].filter((key) => key.startsWith(`${path}/`)).map((key) => ({ name: key.slice(path.length + 1), type: 7 }))
  },
  readFile(uri) {
    const path = normalize(uri)
    if (path.endsWith('/stats')) {
      return JSON.stringify({ listings, validations })
    }
    if (!contents.has(path)) {
      throw new Error('ENOENT')
    }
    return contents.get(path)!
  },
  remove(uri) {
    contents.delete(normalize(uri))
    version++
  },
  rename(oldUri, newUri) {
    const oldPath = normalize(oldUri)
    contents.set(normalize(newUri), contents.get(oldPath) || '')
    contents.delete(oldPath)
    version++
  },
  writeFile(uri, content) {
    contents.set(normalize(uri), content)
    version++
  },
}
await activateExtensionApi()
registerFileSystemProvider(provider)
