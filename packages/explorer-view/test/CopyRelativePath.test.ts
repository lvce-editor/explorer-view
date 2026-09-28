import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { copyRelativePath } from '../src/parts/CopyRelativePath/CopyRelativePath.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

test('copyRelativePath - copies relative path of focused dirent', async (): Promise<void> => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'file.txt', selected: false, type: DirentType.File, uri: '/test/file.txt' }],
  }
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText'() {},
  })
  const result = await copyRelativePath(state)
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['ClipBoard.writeText', 'test/file.txt']])
})

test('copyRelativePath - returns state when no focused dirent', async (): Promise<void> => {
  const state = createDefaultState()
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText'() {},
  })
  const result = await copyRelativePath(state)
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('copyRelativePath - slices first character from path', async (): Promise<void> => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'file.txt', selected: false, type: DirentType.File, uri: '/single' }],
  }
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText'() {},
  })
  await copyRelativePath(state)
  expect(mockRpc.invocations).toEqual([['ClipBoard.writeText', 'single']])
})

test('copyRelativePath - handles nested paths correctly', async (): Promise<void> => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'file.txt', selected: false, type: DirentType.File, uri: '/a/b/c/file.txt' }],
  }
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText'() {},
  })
  await copyRelativePath(state)
  expect(mockRpc.invocations).toEqual([['ClipBoard.writeText', 'a/b/c/file.txt']])
})

test('copyRelativePath - strips workspace root prefix from runtime paths', async (): Promise<void> => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'file.txt', selected: false, type: DirentType.File, uri: 'memfs:///workspace/a/b.txt' }],
    pathSeparator: '/',
    root: 'memfs:///workspace',
  }
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText'() {},
  })
  await copyRelativePath(state)
  expect(mockRpc.invocations).toEqual([['ClipBoard.writeText', 'a/b.txt']])
})

test('copyRelativePath - returns state after writing to clipboard', async (): Promise<void> => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'file.txt', selected: false, type: DirentType.File, uri: '/test/file.txt' }],
  }
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText'() {},
  })
  const result = await copyRelativePath(state)
  expect(result).toBe(state)
  expect(mockRpc.invocations).toHaveLength(1)
})
