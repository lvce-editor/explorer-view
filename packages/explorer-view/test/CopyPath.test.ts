import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { copyPath } from '../src/parts/CopyPath/CopyPath.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

test('copyPath - writes absolute path of focused dirent to clipboard', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText'(text: string) {
      return
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ name: 'file.txt', type: DirentType.File, path: '/test/file.txt', depth: 0, selected: false }],
    focusedIndex: 0,
  }

  const result = await copyPath(state)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([
    ['ClipBoard.writeText', '/test/file.txt'],
  ])
})

test('copyPath - does nothing when no focused dirent', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText'() {
      return
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [],
    focusedIndex: 0,
  }

  const result = await copyPath(state)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})
