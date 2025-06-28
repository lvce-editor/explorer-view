import { expect, jest, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleCopy } from '../src/parts/HandleCopy/HandleCopy.ts'
import { handleCut } from '../src/parts/HandleCut/HandleCut.ts'
import { handlePaste } from '../src/parts/HandlePaste/HandlePaste.ts'
import * as RendererWorker from '../src/parts/RendererWorker/RendererWorker.ts'

test('pasteShouldMove should be true after cut operation', async () => {
  const mockRpc = MockRpc.create({
    invoke: jest.fn(),
    commandMap: {},
  })
  RendererWorker.set(mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0, selected: false }],
  }

  const result = await handleCut(state)

  expect(result.pasteShouldMove).toBe(true)
  expect(mockRpc.invoke).toHaveBeenCalledWith('ClipBoard.writeNativeFiles', 'cut', ['/test.txt'])
})

test('pasteShouldMove should be false after copy operation', async () => {
  const mockRpc = MockRpc.create({
    invoke: jest.fn(),
    commandMap: {},
  })
  RendererWorker.set(mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0, selected: false }],
  }

  const result = await handleCopy(state)

  expect(result.pasteShouldMove).toBe(false)
  expect(mockRpc.invoke).toHaveBeenCalledWith('ClipBoard.writeNativeFiles', 'copy', ['/test.txt'])
})

test.skip('pasteShouldMove should be reset to false after paste operation', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'ClipBoard.readNativeFiles') {
        return {
          type: 'copy',
          files: ['/source/file.txt'],
          source: 'gnomeCopiedFiles',
        }
      }
      if (method === 'FileSystem.copy') {
        return undefined
      }
      if (method === 'FileSystem.rename') {
        return undefined
      }
      if (method === 'FileSystem.readDirWithFileTypes') {
        return []
      }
      if (method === 'FileSystem.getPathSeparator') {
        return '/'
      }
      if (method === 'FileSystem.getBaseName') {
        return 'file.txt'
      }
      if (method === 'Preferences.get') {
        return false
      }
      if (method === 'IconTheme.getIcons') {
        return ['']
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    pasteShouldMove: true, // Simulate state after cut operation
  }

  const result = await handlePaste(state)

  expect(result.pasteShouldMove).toBe(false)
})
