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
const dragAndDropWorkerPackagePath = fileURLToPath(import.meta.resolve('@lvce-editor/drag-and-drop-worker/package.json'))
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

const dragAndDropWorkerMainPath = join(dirname(dragAndDropWorkerPackagePath), 'dist', 'dragAndDropWorkerMain.js')
const dragAndDropWorkerRemoteUrl = getRemoteUrl(dragAndDropWorkerMainPath)
const dragAndDropCommand = 'SendMessagePortToExtensionHostWorker.sendMessagePortToDragAndDropWorker'
let rendererWorkerContent = await readFile(rendererWorkerMainPath, 'utf-8')
const retainedFileHandles = `return handles.map(value => ({ kind: 'file', type: '', value }));`
if (!rendererWorkerContent.includes(retainedFileHandles)) {
  const occurrence = /const getFileHandles = ids => \{\n  return (invoke\$[\dA-Za-z]+)\('FileHandles\.get', ids\);\n\};/
  const match = rendererWorkerContent.match(occurrence)
  if (!match) {
    throw new Error('renderer retained file handles occurrence not found')
  }
  const replacement = `const getFileHandles = async ids => {
  const handles = await ${match[1]}('FileHandles.get', ids);
  ${retainedFileHandles}
};`
  rendererWorkerContent = rendererWorkerContent.replace(occurrence, replacement)
}
if (!rendererWorkerContent.includes(dragAndDropCommand)) {
  const commandOccurrence = `  'SendMessagePortToExtensionHostWorker.sendMessagePortToEditorWorker': lazy('SendMessagePortToExtensionHostWorker.sendMessagePortToEditorWorker'),`
  const commandReplacement = `  '${dragAndDropCommand}': lazy('${dragAndDropCommand}'),
${commandOccurrence}`
  const launcherOccurrence = `const {
  invokeAndTransfer: invokeAndTransfer$d
} = getOrCreateWorker(launchDiffWorker);`
  const launcherReplacement = `${launcherOccurrence}

const dragAndDropWorkerUrl = '${dragAndDropWorkerRemoteUrl}';

const launchDragAndDropWorker = async () => {
  const name = 'Drag And Drop Worker';
  const ipc = await create$19({
    method: ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl$1('develop.dragAndDropWorkerPath', dragAndDropWorkerUrl)
  });
  handleIpc(ipc);
  return ipc;
};

const {
  invokeAndTransfer: invokeAndTransferDragAndDropWorker
} = getOrCreateWorker(launchDragAndDropWorker);`
  const sendOccurrence = `const sendMessagePortToDiffWorker = async (port, initialCommand, rpcId) => {
  object(port);
  string(initialCommand);
  await invokeAndTransfer$d(initialCommand, port, rpcId);
};`
  const sendReplacement = `${sendOccurrence}
const sendMessagePortToDragAndDropWorker = async (port) => {
  object(port);
  await invokeAndTransferDragAndDropWorker('DragAndDrop.handleMessagePort', port);
};`
  const exportOccurrence = `  sendMessagePortToDiffWorker: sendMessagePortToDiffWorker,`
  const exportReplacement = `${exportOccurrence}
  sendMessagePortToDragAndDropWorker: sendMessagePortToDragAndDropWorker,`
  for (const occurrence of [commandOccurrence, launcherOccurrence, sendOccurrence, exportOccurrence]) {
    if (!rendererWorkerContent.includes(occurrence)) {
      throw new Error(`renderer drag and drop worker occurrence not found: ${occurrence}`)
    }
  }
  rendererWorkerContent = rendererWorkerContent
    .replace(commandOccurrence, commandReplacement)
    .replace(launcherOccurrence, launcherReplacement)
    .replace(sendOccurrence, sendReplacement)
    .replace(exportOccurrence, exportReplacement)
}
await writeFile(rendererWorkerMainPath, rendererWorkerContent)

const testWorkerMainPath = join(serverStaticPath, commitHash, 'packages', 'test-worker', 'dist', 'testWorkerMain.js')
const testWorkerContent = await readFile(testWorkerMainPath, 'utf-8')
const resetOccurrence = `    await invoke$1('Layout.reset');`
const resetReplacement = `    await invoke$1('FileSystem.remove', 'memfs:///workspace');
    await invoke$1('Layout.reset');
    await invoke$1('Layout.hideSideBar');
    await invoke$1('Layout.showSideBar');`

if (!testWorkerContent.includes(resetReplacement)) {
  if (!testWorkerContent.includes(resetOccurrence)) {
    throw new Error('test worker reset occurrence not found')
  }
  await writeFile(testWorkerMainPath, testWorkerContent.replace(resetOccurrence, resetReplacement))
}
