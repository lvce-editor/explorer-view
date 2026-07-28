import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { confirmDelete } from '../src/parts/ConfirmDelete/ConfirmDelete.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

test('confirmDelete - single file', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt'() {
      return true
    },
  })
  const result = await confirmDelete([{ depth: 0, name: 'file.txt', path: '/test/file.txt', selected: false, type: DirentType.File }])
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['ConfirmPrompt.prompt', 'Are you sure you want to delete "/test/file.txt"?', undefined]])
})

test('confirmDelete - multiple folders', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt'() {
      return false
    },
  })

  const result = await confirmDelete([
    { depth: 0, name: 'folder-1', path: '/test/folder-1', selected: true, type: DirentType.Directory },
    { depth: 0, name: 'folder-2', path: '/test/folder-2', selected: true, type: DirentType.Directory },
  ])
  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['ConfirmPrompt.prompt', 'Are you sure you want to delete "folder-1", "folder-2"?', undefined]])
})
