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
    items: [{ type: DirentType.File, name: 'test.txt', path: '/test.txt', depth: 0, selected: false }],
    focusedIndex: 0,
  }
  const result = await handleArrowRight(state)
  expect(result).toBe(state)
})

test.skip('handleArrowRight - directory', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ type: DirentType.Directory, name: 'test', path: '/test', depth: 0, selected: false }],
    focusedIndex: 0,
  }
  const result = await handleArrowRight(state)
  expect(result).not.toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('handleArrowRight - symlink file', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ type: DirentType.SymLinkFile, name: 'test.txt', path: '/test.txt', depth: 0, selected: false }],
    focusedIndex: 0,
  }
  const result = await handleArrowRight(state)
  expect(result).toBe(state)
})

test.skip('handleArrowRight - symlink folder', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ type: DirentType.SymLinkFolder, name: 'test', path: '/test', depth: 0, selected: false }],
    focusedIndex: 0,
  }
  const result = await handleArrowRight(state)
  expect(result).not.toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test.skip('handleArrowRight - directory expanded', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ type: DirentType.DirectoryExpanded, name: 'test', path: '/test', depth: 0, selected: false }],
    focusedIndex: 0,
  }
  const result = await handleArrowRight(state)
  expect(result).not.toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test.skip('handleArrowRight - symlink', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getRealPath'() {
      return '/real/path'
    },
    'FileSystem.stat'() {
      return { isDirectory: (): boolean => false }
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ type: DirentType.Symlink, name: 'test', path: '/test', depth: 0, selected: false }],
    focusedIndex: 0,
  }
  const result = await handleArrowRight(state)
  expect(result).not.toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('handleArrowRight - invalid type', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ type: 999, name: 'test', path: '/test', depth: 0, selected: false }],
    focusedIndex: 0,
  }
  await expect(handleArrowRight(state)).rejects.toThrow('unsupported file type 999')
})
