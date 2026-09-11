import { cp } from 'node:fs/promises'
import { join } from 'node:path'
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

const workerPath = join(root, '.tmp/dist/dist/explorerViewWorkerMain.js')

const explorerWorkerPath = join(root, 'dist', commitHash, 'packages', 'explorer-worker', 'dist', 'explorerViewWorkerMain.js')
await cp(workerPath, explorerWorkerPath)

await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })
