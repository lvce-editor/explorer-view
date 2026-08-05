import { expect, test } from '@jest/globals'
import { DragAndDropWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleDrop } from '../src/parts/HandleDrop/HandleDrop.ts'

test('handleDrop - successful drop', async () => {
  using dragRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.getDroppedItems'() {
      return { files: [], strings: [], uris: [] }
    },
  })
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()

  const result = await handleDrop(state, 0, 0, [1])
  expect(result).toBeDefined()
  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedItems', [1], false]])
  expect(mockRpc.invocations).toEqual([['FileSystem.readDirWithFileTypes', '/']])
})

test('handleDrop - error case', async () => {
  using dragRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.getDroppedItems'() {
      throw new Error('test error')
    },
  })

  const state = createDefaultState()

  await expect(handleDrop(state, 0, 0, [1])).rejects.toThrow(new Error('Failed to drop files: test error'))
  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedItems', [1], false]])
})
