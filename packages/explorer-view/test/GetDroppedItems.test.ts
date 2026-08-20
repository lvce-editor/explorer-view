import { expect, test } from '@jest/globals'
import { DragAndDropWorker } from '@lvce-editor/rpc-registry'
import { getDroppedItems } from '../src/parts/GetDroppedItems/GetDroppedItems.ts'

test('normalizes worker files for browser explorer handling', async () => {
  const handle = { kind: 'file', name: 'notes.txt' }
  using dragRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.getDroppedItems'() {
      return {
        files: [
          { handle, kind: 'file', name: 'notes.txt', path: '', uri: 'html:///notes.txt' },
          { handle: undefined, kind: 'file', name: 'legacy.txt', path: '', uri: '' },
        ],
        strings: [],
        uris: ['html:///notes.txt'],
      }
    },
  })

  expect(await getDroppedItems([1, 2], false)).toEqual({ fileHandles: [handle], paths: [''], uris: ['html:///notes.txt'] })
  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedItems', [1, 2], false]])
})

test('keeps path-only electron files', async () => {
  using _dragRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.getDroppedItems'() {
      return {
        files: [{ handle: undefined, kind: 'file', name: 'legacy.txt', path: '/tmp/legacy.txt', uri: 'file:///tmp/legacy.txt' }],
        strings: [],
        uris: ['file:///tmp/legacy.txt'],
      }
    },
  })

  expect(await getDroppedItems([1], true)).toEqual({
    fileHandles: [{ kind: 'file', name: 'legacy.txt' }],
    paths: ['/tmp/legacy.txt'],
    uris: ['file:///tmp/legacy.txt'],
  })
})

test('resolves opt-in drop data by drop id', async () => {
  const handle = { kind: 'file', name: 'notes.txt' }
  using dragRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.getDroppedItemsByDropId'() {
      return {
        files: [{ handle, kind: 'file', name: 'notes.txt', path: '', uri: 'html:///notes.txt' }],
        strings: [],
        uris: ['html:///notes.txt'],
      }
    },
  })

  await expect(getDroppedItems(17, false)).resolves.toEqual({
    fileHandles: [handle],
    paths: [''],
    uris: ['html:///notes.txt'],
  })
  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedItemsByDropId', 17, false]])
})
