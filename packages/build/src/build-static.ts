import { cp, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { restoreStaticWorkerUrls } from './restoreStaticWorkerUrl.ts'
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

const content = await readFile(rendererWorkerPath, 'utf8')
const workerPath = join(root, '.tmp/dist/dist/explorerViewWorkerMain.js')

const newContent = restoreStaticWorkerUrls(content)
await writeFile(rendererWorkerPath, newContent)

const explorerWorkerPath = join(root, 'dist', commitHash, 'packages', 'explorer-worker', 'dist', 'explorerViewWorkerMain.js')
await cp(workerPath, explorerWorkerPath)

await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })
