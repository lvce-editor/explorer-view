const contents = Object.create(null)

const fileSystemProvider = {
  id: 'xyz',
  writeFile(uri, content) {
    contents[uri] = content
    if (uri === '/file4.txt') {
      throw new Error(`Permission Denied`)
    }
  },
  readFile(uri) {
    throw new Error(
      `VError: Failed to request text from "/language-basics-typescript/3c2c8cd/playground/playground/babel-parser-base.ts": ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor`,
    )
  },
  pathSeparator: '/',
  readDirWithFileTypes(uri) {
    const results = []
    for (const [key, value] of Object.entries(contents)) {
      if (key.startsWith(uri)) {
        results.push({
          type: 7,
          name: key.slice(key.lastIndexOf('/')),
        })
      }
    }
    console.log({ contents, results })
    return results
  },
}

export const activate = () => {
  vscode.registerFileSystemProvider(fileSystemProvider)
}
