import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { revealItemHidden } from '../src/parts/RevealItemHidden/RevealItemHidden.ts'


test('revealItemHidden - reveals hidden item', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === '/root') {
        return [{ name: 'folder1', isDirectory: true, type: DirentType.File, path: '/root/folder1' }]
      }
      if (path === '/root/folder1') {
        return [
          { name: 'file1.txt', isDirectory: false, type: DirentType.File, path: '/root/folder1/file1.txt' },
          { name: 'file2.txt', isDirectory: false, type: DirentType.File, path: '/root/folder1/file2.txt' },
        ]
      }
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    root: '/root',
  }
  const newState = await revealItemHidden(state, '/root/folder1/file1.txt')
  expect(newState.items.length).toBeGreaterThan(0)
  expect(newState.focused).toBe(true)
  expect(newState.focusedIndex).toBeGreaterThanOrEqual(0)
})

test('revealItemHidden - returns same state for empty path parts', async () => {
  const state = createDefaultState()
  const newState = await revealItemHidden(state, '')
  expect(newState).toEqual(state)
})

test('revealItemHidden - throws error for non-existent file', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })
  const state = createDefaultState()
  await expect(revealItemHidden(state, '/non/existent/file.txt')).rejects.toThrow('File not found in explorer')
})
