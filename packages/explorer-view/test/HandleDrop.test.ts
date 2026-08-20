import { expect, test } from '@jest/globals'
import { DragAndDropWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
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

test('handleDrop - discards an opt-in drop for a readonly workspace', async () => {
  using dragRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.discardDrop'() {},
  })
  const state = {
    ...createDefaultState(),
    isReadonly: true,
    root: '/workspace',
  }

  await expect(handleDrop(state, 0, 0, 21)).resolves.toBe(state)
  expect(dragRpc.invocations).toEqual([['DragAndDrop.discardDrop', 21]])
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

test('handleDrop - moves an internal Explorer file into the drop target folder', async () => {
  let moved = false
  using dragRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.getDroppedItems'() {
      return { files: [], strings: [], uris: ['file:///workspace/Main.elm'] }
    },
  })
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === '/workspace') {
        return [{ name: 'src', type: DirentType.Directory }, ...(moved ? [] : [{ name: 'Main.elm', type: DirentType.File }])]
      }
      return moved ? [{ name: 'Main.elm', type: DirentType.File }] : []
    },
    'FileSystem.rename'() {
      moved = true
    },
  })
  const state = {
    ...createDefaultState(),
    items: [
      { depth: 1, name: 'src', path: '/workspace/src', selected: false, type: DirentType.Directory },
      { depth: 1, name: 'Main.elm', path: '/workspace/Main.elm', selected: false, type: DirentType.File },
    ],
    root: '/workspace',
  }

  const result = await handleDrop(state, 0, 0, [1])

  expect(result.items.map((item) => item.path)).toEqual(['/workspace/src', '/workspace/src/Main.elm'])
  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedItems', [1], false]])
  expect(mockRpc.invocations).toContainEqual(['FileSystem.rename', '/workspace/Main.elm', '/workspace/src/Main.elm'])
})

test('handleDrop - wraps internal move failures', async () => {
  using _dragRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.getDroppedItems'() {
      return { files: [], strings: [], uris: ['file:///workspace/Main.elm'] }
    },
  })
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.rename'() {
      throw new Error('permission denied')
    },
  })
  const state = {
    ...createDefaultState(),
    items: [
      { depth: 1, name: 'src', path: '/workspace/src', selected: false, type: DirentType.Directory },
      { depth: 1, name: 'Main.elm', path: '/workspace/Main.elm', selected: false, type: DirentType.File },
    ],
    root: '/workspace',
  }

  await expect(handleDrop(state, 0, 0, [1])).rejects.toThrow('Failed to drop files: permission denied')
})
