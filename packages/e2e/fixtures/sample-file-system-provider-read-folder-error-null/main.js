const contents = Object.create(null)

const fileSystemProvider = {
  id: 'xyz',
  writeFile(uri, content) {
    contents[uri] = content
  },
  rename(oldUri, newUri) {},
  readFile(uri) {
    return contents[uri]
  },
  pathSeparator: '/',
  readDirWithFileTypes(uri) {
    throw null
  },
  remove(uri) {
    throw new Error(`oops`)
  },
}

export const activate = () => {
  vscode.registerFileSystemProvider(fileSystemProvider)
}
