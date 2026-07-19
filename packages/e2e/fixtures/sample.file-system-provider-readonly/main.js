const contents = Object.create(null)

const fileSystemProvider = {
  id: 'readonly',
  isReadonly() {
    return true
  },
  readDirWithFileTypes(uri) {
    const results = []
    for (const key of Object.keys(contents)) {
      if (key.startsWith(uri)) {
        results.push({
          name: key.slice(key.lastIndexOf('/') + 1),
          type: 1,
        })
      }
    }
    return results
  },
  readFile(uri) {
    return contents[uri]
  },
  writeFile(uri, content) {
    contents[uri] = content
  },
}

export const activate = () => {
  vscode.registerFileSystemProvider(fileSystemProvider)
}
