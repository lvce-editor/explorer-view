import { expect, test } from '@jest/globals'
import { DragAndDropWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { getClipboardItems, getDroppedItems } from '../src/parts/GetDroppedItems/GetDroppedItems.ts'

test('normalizes worker files for browser explorer handling', async () => {
  const handle = { kind: 'file', name: 'notes.txt' }
  using rendererRpc = RendererWorker.registerMockRpc({
    'FileHandles.get'() {
      return [
        { kind: 'file', path: '', value: handle },
        { kind: 'file-legacy', path: '', value: new File(['legacy'], 'legacy.txt') },
      ]
    },
  })

  expect(await getClipboardItems([1, 2], false)).toEqual({ fileHandles: [handle], paths: [''], uris: [] })
  expect(rendererRpc.invocations).toEqual([['FileHandles.get', [1, 2]]])
})

test('keeps path-only electron files', async () => {
  using _rendererRpc = RendererWorker.registerMockRpc({
    'FileHandles.get'() {
      return [{ kind: 'file-legacy', path: '/tmp/legacy.txt', value: new File(['legacy'], 'legacy.txt') }]
    },
  })

  expect(await getClipboardItems([1], true)).toEqual({
    fileHandles: [{ kind: 'file', name: 'legacy.txt' }],
    paths: ['/tmp/legacy.txt'],
    uris: [],
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
