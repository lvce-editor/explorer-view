import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleCopy } from '../src/parts/HandleCopy/HandleCopy.ts'
import { handleCut } from '../src/parts/HandleCut/HandleCut.ts'
import { handlePaste } from '../src/parts/HandlePaste/HandlePaste.ts'

test('pasteShouldMove should be true after cut operation', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeNativeFiles'() {},
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0, selected: false }],
  }

  const result = await handleCut(state)

  expect(result.pasteShouldMove).toBe(true)
  expect(mockRpc.invocations).toEqual([['ClipBoard.writeNativeFiles', 'cut', ['/test.txt']]])
})

test('pasteShouldMove should be false after copy operation', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeNativeFiles'() {},
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0, selected: false }],
  }

  const result = await handleCopy(state)

  expect(result.pasteShouldMove).toBe(false)
  expect(mockRpc.invocations).toEqual([['ClipBoard.writeNativeFiles', 'copy', ['/test.txt']]])
})

test('pasteShouldMove should be reset to false after paste operation', async () => {
  RendererWorker.registerMockRpc({
    'ClipBoard.readNativeFiles'() {
      return {
        type: 'copy',
        files: ['/source/file.txt'],
      }
    },
    'FileSystem.rename'() {},
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'Preferences.get'() {
      return false
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    pasteShouldMove: true, // Simulate state after cut operation
    focusedIndex: -1, // No item focused, use root as target
  }

  const result = await handlePaste(state)

  expect(result.pasteShouldMove).toBe(false)
})
