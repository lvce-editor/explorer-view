import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleArrowRight } from '../src/parts/HandleArrowRight/HandleArrowRight.ts'

test('handleArrowRight - no focused item', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
  }
  const result = await handleArrowRight(state)
  expect(result).toBe(state)
})

test('handleArrowRight - file', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'test.txt', selected: false, type: DirentType.File, uri: '/test.txt' }],
  }
  const result = await handleArrowRight(state)
  expect(result).toBe(state)
})

test.skip('handleArrowRight - directory', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'test', selected: false, type: DirentType.Directory, uri: '/test' }],
  }
  const result = await handleArrowRight(state)
  expect(result).not.toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('handleArrowRight - symlink file', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'test.txt', selected: false, type: DirentType.SymLinkFile, uri: '/test.txt' }],
  }
  const result = await handleArrowRight(state)
  expect(result).toBe(state)
})

test.skip('handleArrowRight - symlink folder', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'test', selected: false, type: DirentType.SymLinkFolder, uri: '/test' }],
  }
  const result = await handleArrowRight(state)
  expect(result).not.toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test.skip('handleArrowRight - directory expanded', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'test', selected: false, type: DirentType.DirectoryExpanded, uri: '/test' }],
  }
  const result = await handleArrowRight(state)
  expect(result).not.toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test.skip('handleArrowRight - symlink', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getRealPath'() {
      return '/real/path'
    },
    'FileSystem.stat'() {
      return { isDirectory: (): boolean => false }
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'test', selected: false, type: DirentType.Symlink, uri: '/test' }],
  }
  const result = await handleArrowRight(state)
  expect(result).not.toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('handleArrowRight - invalid type', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'test', selected: false, type: 999, uri: '/test' }],
  }
  await expect(handleArrowRight(state)).rejects.toThrow('unsupported file type 999')
})
