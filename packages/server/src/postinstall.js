import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const __dirname = import.meta.dirname

const root = join(__dirname, '..', '..', '..')

export const getRemoteUrl = (path) => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const nodeModulesPath = join(root, 'packages', 'server', 'node_modules')

const workerPath = join(root, '.tmp', 'dist', 'dist', 'explorerViewWorkerMain.js')

const serverStaticPath = join(nodeModulesPath, '@lvce-editor', 'static-server', 'static')

const RE_COMMIT_HASH = /^[a-z\d]+$/
const isCommitHash = (dirent) => {
  return dirent.length === 7 && dirent.match(RE_COMMIT_HASH)
}

const dirents = await readdir(serverStaticPath)
const commitHash = dirents.find(isCommitHash) || ''
const rendererWorkerMainPath = join(serverStaticPath, commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')

let content = await readFile(rendererWorkerMainPath, 'utf-8')

const remoteUrl = getRemoteUrl(workerPath)
if (!content.includes('// const explorerWorkerUrl = ')) {
  const occurrence = `const explorerWorkerUrl = \`\${assetDir}/packages/explorer-worker/dist/explorerViewWorkerMain.js\`;`
  const replacement = `// const explorerWorkerUrl = \`\${assetDir}/packages/explorer-worker/dist/explorerViewWorkerMain.js\`;
const explorerWorkerUrl = \`${remoteUrl}\`;`

  content = content.replace(occurrence, replacement)
  await writeFile(rendererWorkerMainPath, content)
}

const duplicateDynamicCommandOccurrence = `const updateDynamic = (commands, key, fn) => {
  const keyIndex = commands.findIndex(command => command[0] === key);`
const duplicateDynamicCommandReplacement = `const updateDynamic = (commands, key, fn) => {
  const matchingCommands = commands.filter(command => command[0] === key);
  if (matchingCommands.length > 1) {
    throw new Error(\`[flaky-e2e-debug] duplicate dynamic commands for \${key}: \${JSON.stringify(matchingCommands)}\`);
  }
  const keyIndex = commands.findIndex(command => command[0] === key);`

if (!content.includes(duplicateDynamicCommandReplacement)) {
  if (!content.includes(duplicateDynamicCommandOccurrence)) {
    throw new Error('renderer worker dynamic command occurrence not found')
  }
  content = content.replace(duplicateDynamicCommandOccurrence, duplicateDynamicCommandReplacement)
  await writeFile(rendererWorkerMainPath, content)
}

const explorerWorkerMainPath = join(serverStaticPath, commitHash, 'packages', 'explorer-worker', 'dist', 'explorerViewWorkerMain.js')
const explorerWorkerContent = await readFile(explorerWorkerMainPath, 'utf-8')
const explorerRenderOccurrence = `const render2 = (uid, diffResult) => {
  const {
    oldState,
    scheduledState
  } = get(uid);
  set(uid, scheduledState, scheduledState);`
const explorerRenderReplacement = `const render2 = (uid, diffResult) => {
  const {
    oldState,
    scheduledState
  } = get(uid);
  const currentDiffResult = diff(oldState, scheduledState);
  if (JSON.stringify(diffResult) !== JSON.stringify(currentDiffResult)) {
    throw new Error(\`[flaky-e2e-debug] stale bundled explorer diff: \${JSON.stringify({
      currentDiffResult,
      diffResult,
      oldItemNames: oldState.items.slice(0, 20).map(item => item.name),
      scheduledItemNames: scheduledState.items.slice(0, 20).map(item => item.name),
      uid
    })}\`);
  }
  set(uid, scheduledState, scheduledState);`

if (!explorerWorkerContent.includes(explorerRenderReplacement)) {
  if (!explorerWorkerContent.includes(explorerRenderOccurrence)) {
    throw new Error('explorer worker render occurrence not found')
  }
  await writeFile(explorerWorkerMainPath, explorerWorkerContent.replace(explorerRenderOccurrence, explorerRenderReplacement))
}

const rendererProcessMainPath = join(serverStaticPath, commitHash, 'packages', 'renderer-process', 'dist', 'rendererProcessMain.js')
const rendererProcessContent = await readFile(rendererProcessMainPath, 'utf-8')
const executeCommandsOccurrence = `const executeCommands = commands => {
  for (const [command, ...args] of commands) {
    const fn = getFn(command);
    // @ts-ignore
    fn(...args);
  }
};`
const executeCommandsReplacement = `const executeCommands = commands => {
  for (let index = 0; index < commands.length; index++) {
    const [command, ...args] = commands[index];
    try {
      const fn = getFn(command);
      // @ts-ignore
      fn(...args);
    } catch (error) {
      throw new Error(\`[flaky-e2e-debug] renderer command failed at index \${index}: \${JSON.stringify(commands)}\`, { cause: error });
    }
  }
};`

if (!rendererProcessContent.includes(executeCommandsReplacement)) {
  if (!rendererProcessContent.includes(executeCommandsOccurrence)) {
    throw new Error('renderer process execute commands occurrence not found')
  }
  await writeFile(rendererProcessMainPath, rendererProcessContent.replace(executeCommandsOccurrence, executeCommandsReplacement))
}

const testWorkerMainPath = join(serverStaticPath, commitHash, 'packages', 'test-worker', 'dist', 'testWorkerMain.js')
const testWorkerContent = await readFile(testWorkerMainPath, 'utf-8')
const resetOccurrence = `    await invoke('Layout.reset');`
const resetReplacement = `    await invoke('FileSystem.remove', 'memfs:///workspace');
    await invoke('Layout.reset');
    await invoke('Layout.hideSideBar');
    await invoke('Layout.showSideBar');`

if (!testWorkerContent.includes(resetReplacement)) {
  if (!testWorkerContent.includes(resetOccurrence)) {
    throw new Error('test worker reset occurrence not found')
  }
  await writeFile(testWorkerMainPath, testWorkerContent.replace(resetOccurrence, resetReplacement))
}
