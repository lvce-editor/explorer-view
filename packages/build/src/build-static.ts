import { cp, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { root } from './root.ts'

import.meta.resolve('@lvce-editor/static-server')
const sharedProcessUrl = import.meta.resolve('@lvce-editor/shared-process')

const sharedProcess = await import(sharedProcessUrl)

process.env.PATH_PREFIX = '/explorer-view'
const { commitHash } = await sharedProcess.exportStatic({
  root,
  extensionPath: '',
  testPath: 'packages/e2e',
})

const rendererWorkerPath = join(root, 'dist', commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')

export const getRemoteUrl = (path: string): string => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const content = await readFile(rendererWorkerPath, 'utf8')
const workerPath = join(root, '.tmp/dist/dist/explorerViewWorkerMain.js')
const remoteUrl = getRemoteUrl(workerPath)

const occurrence = `// const explorerWorkerUrl = \`\${assetDir}/packages/explorer-worker/dist/explorerViewWorkerMain.js\`;
const explorerWorkerUrl = \`${remoteUrl}\`;`
const replacement = `const explorerWorkerUrl = \`\${assetDir}/packages/explorer-worker/dist/explorerViewWorkerMain.js\`;`
let newContent = content
if (newContent.includes(occurrence)) {
  newContent = newContent.replace(occurrence, replacement)
} else if (!newContent.includes(replacement)) {
  throw new Error('explorer worker url occurrence not found')
}
await writeFile(rendererWorkerPath, newContent)

const explorerWorkerPath = join(root, 'dist', commitHash, 'packages', 'explorer-worker', 'dist', 'explorerViewWorkerMain.js')
await cp(workerPath, explorerWorkerPath)

await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })
