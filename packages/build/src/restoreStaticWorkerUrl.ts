const getStaticDeclaration = (workerName: string, workerPath: string): string => {
  return `const ${workerName}Url = \`\${assetDir}/${workerPath}\`;`
}

const restoreStaticWorkerUrl = (content: string, workerName: string, workerPath: string): string => {
  const staticDeclaration = getStaticDeclaration(workerName, workerPath)
  const commentedStaticDeclaration = `// ${staticDeclaration}`

  if (!content.includes(commentedStaticDeclaration)) {
    if (content.includes(staticDeclaration)) {
      return content
    }
    throw new Error(`${workerName} worker url occurrence not found`)
  }

  const remoteDeclarationStart = `${commentedStaticDeclaration}\nconst ${workerName}Url = \``
  const startIndex = content.indexOf(remoteDeclarationStart)
  if (startIndex === -1) {
    throw new Error(`${workerName} worker url occurrence not found`)
  }
  const endIndex = content.indexOf('`;', startIndex + remoteDeclarationStart.length)
  if (endIndex === -1) {
    throw new Error(`${workerName} worker url occurrence not found`)
  }

  return `${content.slice(0, startIndex)}${staticDeclaration}${content.slice(endIndex + 2)}`
}

const workerUrls = [
  ['mainAreaWorker', 'packages/main-area-worker/dist/mainAreaWorkerMain.js'],
  ['explorerWorker', 'packages/explorer-worker/dist/explorerViewWorkerMain.js'],
] as const

export const restoreStaticWorkerUrls = (content: string): string => {
  let newContent = content
  for (const [workerName, workerPath] of workerUrls) {
    newContent = restoreStaticWorkerUrl(newContent, workerName, workerPath)
  }
  return newContent
}
