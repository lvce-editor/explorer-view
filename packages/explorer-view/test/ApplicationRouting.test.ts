import { afterEach, expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { applyFileOperations } from '../src/parts/ApplyFileOperations/ApplyFileOperations.ts'
import * as CommandCompletion from '../src/parts/CommandCompletion/CommandCompletion.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as FileOperationType from '../src/parts/FileOperationType/FileOperationType.ts'
import { handleClickFile } from '../src/parts/HandleClickFile/HandleClickFile.ts'
import { handleKeyDown } from '../src/parts/HandleKeyDown/HandleKeyDown.ts'
import { loadContent } from '../src/parts/LoadContent/LoadContent.ts'
import { openUri } from '../src/parts/OpenUri/OpenUri.ts'

afterEach(() => {
  jest.clearAllTimers()
  jest.useRealTimers()
})

test('identical workspace URIs load independent directory contents and decorations concurrently', async () => {
  const gate = Promise.withResolvers<void>()
  const entered = Promise.withResolvers<void>()
  using rpc = RendererWorker.registerMockRpc({
    async 'Application.execute'(applicationId: string, method: string) {
      switch (method) {
        case 'ExtensionHostSourceControl.getEnabledProviderIds':
          return ['sample']
        case 'ExtensionHostSourceControl.getFileDecorations':
          return [{ decoration: applicationId, uri: `memfs:///workspace/${applicationId}.ts` }]
        case 'FileSystem.isReadonly':
          return false
        case 'FileSystem.readDirWithFileTypes':
          if (applicationId === 'source') {
            entered.resolve()
            await gate.promise
          }
          return [{ name: `${applicationId}.ts`, type: DirentType.File }]
        case 'Workspace.getUri':
          return 'memfs:///workspace'
        default:
          throw new Error(`Unexpected command ${method}`)
      }
    },
    'Preferences.get': (key: string) => key === 'explorer.sourceControlDecorations',
  })
  const source = loadContent({ ...createDefaultState(), applicationId: 'source', uid: 1 }, undefined)
  await entered.promise
  const preview = await loadContent({ ...createDefaultState(), applicationId: 'preview', uid: 2 }, undefined)
  gate.resolve()
  const loadedSource = await source
  expect(loadedSource.items.map((item) => item.name)).toEqual(['source.ts'])
  expect(preview.items.map((item) => item.name)).toEqual(['preview.ts'])
  expect(loadedSource.decorations).toEqual([{ decoration: 'source', uri: 'memfs:///workspace/source.ts' }])
  expect(preview.decorations).toEqual([{ decoration: 'preview', uri: 'memfs:///workspace/preview.ts' }])
  expect(rpc.invocations.some(([method]) => method === 'FileSystem.readDirWithFileTypes')).toBe(false)
})

test('opening a file or manifest targets the owning main area', async () => {
  using rpc = RendererWorker.registerMockRpc({ 'Application.execute': async () => {} })
  await openUri('memfs:///extension.json', true, undefined, 'source')
  const state = { ...createDefaultState(), applicationId: 'source', uid: 1 }
  const item = { depth: 1, name: 'main.ts', path: 'memfs:///main.ts', selected: false, type: DirentType.File }
  const clicked = await handleClickFile(state, item, 0)
  await CommandCompletion.take(clicked)
  expect(rpc.invocations).toContainEqual(['Application.execute', 'source', 'Main.openUri', { focus: true, uri: 'memfs:///extension.json' }])
  expect(rpc.invocations).toContainEqual([
    'Application.execute',
    'source',
    'Main.openInput',
    { editorInput: { type: 'editor', uri: 'memfs:///main.ts' }, focus: true, preview: true },
  ])
})

test('file operations preserve the application through every mutation in a batch', async () => {
  using rpc = RendererWorker.registerMockRpc({ 'Application.execute': async () => {} })
  const path = 'memfs:///extension.json'
  expect(
    await applyFileOperations(
      [
        { path: 'memfs:///icons', type: FileOperationType.CreateFolder },
        { path, text: '{}', type: FileOperationType.CreateFile },
        { from: path, path: 'memfs:///copy.json', type: FileOperationType.Copy },
        { from: path, path: 'memfs:///renamed.json', type: FileOperationType.Rename },
        { path: 'memfs:///copy.json', type: FileOperationType.Remove },
      ],
      'source',
    ),
  ).toBe('')
  expect(rpc.invocations.map((call) => call.slice(0, 3))).toEqual([
    ['Application.execute', 'source', 'FileSystem.mkdir'],
    ['Application.execute', 'source', 'FileSystem.writeFile'],
    ['Application.execute', 'source', 'FileSystem.copy'],
    ['Application.execute', 'source', 'FileSystem.rename'],
    ['Application.execute', 'source', 'FileSystem.remove'],
  ])
})

test('type-ahead timeouts are independent for both explorer components', async () => {
  jest.useFakeTimers()
  using rpc = RendererWorker.registerMockRpc({ 'Application.executeForView': async () => {} })
  handleKeyDown({ ...createDefaultState(), applicationId: 'source', focusWordTimeout: 100, uid: 1 }, false, 'a')
  handleKeyDown({ ...createDefaultState(), applicationId: 'preview', focusWordTimeout: 200, uid: 2 }, false, 'b')
  await jest.advanceTimersByTimeAsync(100)
  expect(rpc.invocations).toEqual([['Application.executeForView', 1, 'Explorer.cancelTypeAhead']])
  await jest.advanceTimersByTimeAsync(100)
  expect(rpc.invocations).toContainEqual(['Application.executeForView', 2, 'Explorer.cancelTypeAhead'])
})
