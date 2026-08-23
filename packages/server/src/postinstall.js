import { readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = import.meta.dirname

const root = join(__dirname, '..', '..', '..')

export const getRemoteUrl = (path) => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const workerPath = join(root, '.tmp', 'dist', 'dist', 'explorerViewWorkerMain.js')

const staticServerPackagePath = fileURLToPath(import.meta.resolve('@lvce-editor/static-server/package.json'))
const mainAreaWorkerPackagePath = fileURLToPath(import.meta.resolve('@lvce-editor/main-area-worker/package.json'))
const serverStaticPath = join(dirname(staticServerPackagePath), 'static')

const RE_COMMIT_HASH = /^[a-z\d]+$/
const isCommitHash = (dirent) => {
  return dirent.length === 7 && dirent.match(RE_COMMIT_HASH)
}

const dirents = await readdir(serverStaticPath)
const commitHash = dirents.find(isCommitHash) || ''
const rendererWorkerMainPath = join(serverStaticPath, commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')

const content = await readFile(rendererWorkerMainPath, 'utf-8')
let newContent = content

const mainAreaWorkerMainPath = join(dirname(mainAreaWorkerPackagePath), 'dist', 'mainAreaWorkerMain.js')
const mainAreaWorkerRemoteUrl = getRemoteUrl(mainAreaWorkerMainPath)
if (!newContent.includes('// const mainAreaWorkerUrl = ')) {
  const occurrence = `const mainAreaWorkerUrl = \`\${assetDir}/packages/main-area-worker/dist/mainAreaWorkerMain.js\`;`
  const replacement = `// const mainAreaWorkerUrl = \`\${assetDir}/packages/main-area-worker/dist/mainAreaWorkerMain.js\`;
const mainAreaWorkerUrl = \`${mainAreaWorkerRemoteUrl}\`;`
  if (!newContent.includes(occurrence)) {
    throw new Error('main area worker occurrence not found')
  }
  newContent = newContent.replace(occurrence, replacement)
}

const remoteUrl = getRemoteUrl(workerPath)
if (!newContent.includes('// const explorerWorkerUrl = ')) {
  const occurrence = `const explorerWorkerUrl = \`\${assetDir}/packages/explorer-worker/dist/explorerViewWorkerMain.js\`;`
  const replacement = `// const explorerWorkerUrl = \`\${assetDir}/packages/explorer-worker/dist/explorerViewWorkerMain.js\`;
const explorerWorkerUrl = \`${remoteUrl}\`;`

  newContent = newContent.replace(occurrence, replacement)
}

const isTestContextOccurrence = '  isTest: isTest?.() ?? false,'
const dynamicIsTestContext = `  get isTest() {
    return isTest?.() ?? false;
  },`
if (!newContent.includes(dynamicIsTestContext)) {
  const occurrenceCount = newContent.split(isTestContextOccurrence).length - 1
  if (occurrenceCount !== 1) {
    throw new Error(`expected one isTest context occurrence, found ${occurrenceCount}`)
  }
  newContent = newContent.replace(isTestContextOccurrence, dynamicIsTestContext)
}

if (newContent !== content) {
  await writeFile(rendererWorkerMainPath, newContent)
}

const testWorkerMainPath = join(serverStaticPath, commitHash, 'packages', 'test-worker', 'dist', 'testWorkerMain.js')
const testWorkerContent = await readFile(testWorkerMainPath, 'utf-8')
const resetOccurrence = /    await (invoke[^\n(]*)\('Layout\.reset'\);/
const resetReplacement =
  /    await invoke[^\n(]*\('FileSystem\.remove', 'memfs:\/\/\/workspace'\);\n    await invoke[^\n(]*\('FileSystem\.mkdir', 'memfs:\/\/\/workspace'\);\n    await invoke[^\n(]*\('Layout\.reset'\);\n    await invoke[^\n(]*\('Layout\.hideSideBar'\);\n    await invoke[^\n(]*\('Layout\.showSideBar'\);/

if (!resetReplacement.test(testWorkerContent)) {
  if (!resetOccurrence.test(testWorkerContent)) {
    throw new Error('test worker reset occurrence not found')
  }
  const replacement = `    await $1('FileSystem.remove', 'memfs:///workspace');
    await $1('FileSystem.mkdir', 'memfs:///workspace');
    await $1('Layout.reset');
    await $1('Layout.hideSideBar');
    await $1('Layout.showSideBar');`
  await writeFile(testWorkerMainPath, testWorkerContent.replace(resetOccurrence, replacement))
}
