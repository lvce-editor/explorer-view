import { strictEqual, throws } from 'node:assert'
import { test } from 'node:test'
import { restoreStaticWorkerUrls } from '../src/restoreStaticWorkerUrl.ts'

const mainAreaWorkerDeclaration = 'const mainAreaWorkerUrl = `${assetDir}/packages/main-area-worker/dist/mainAreaWorkerMain.js`;'
const explorerWorkerDeclaration = 'const explorerWorkerUrl = `${assetDir}/packages/explorer-worker/dist/explorerViewWorkerMain.js`;'

test('restores remote worker urls to static asset urls', () => {
  const content = `before
// ${mainAreaWorkerDeclaration}
const mainAreaWorkerUrl = \`/remote/home/runner/work/explorer-view/explorer-view/node_modules/@lvce-editor/main-area-worker/dist/mainAreaWorkerMain.js\`;
// ${explorerWorkerDeclaration}
const explorerWorkerUrl = \`/remote/home/runner/work/explorer-view/explorer-view/.tmp/dist/dist/explorerViewWorkerMain.js\`;
after`

  strictEqual(restoreStaticWorkerUrls(content), `before\n${mainAreaWorkerDeclaration}\n${explorerWorkerDeclaration}\nafter`)
})

test('keeps existing static worker urls', () => {
  const content = `${mainAreaWorkerDeclaration}\n${explorerWorkerDeclaration}`
  strictEqual(restoreStaticWorkerUrls(content), content)
})

test('rejects content without the worker urls', () => {
  throws(() => restoreStaticWorkerUrls('const otherWorkerUrl = ``;'), /mainAreaWorker worker url occurrence not found/)
})
