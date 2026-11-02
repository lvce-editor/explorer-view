import { expect, test } from '@jest/globals'
import { DialogWorker } from '@lvce-editor/rpc-registry'
import { confirmDelete } from '../src/parts/ConfirmDelete/ConfirmDelete.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

test('confirmDelete - single file', async () => {
  using mockRpc = DialogWorker.registerMockRpc({
    'ConfirmPrompt.prompt'() {
      return true
    },
  })
  const result = await confirmDelete([{ depth: 0, name: 'file.txt', selected: false, type: DirentType.File, uri: '/test/file.txt' }])
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['ConfirmPrompt.prompt', 'Are you sure you want to delete "/test/file.txt"?', undefined]])
})

test('confirmDelete - remote file displays its path without the server authority', async () => {
  using mockRpc = DialogWorker.registerMockRpc({
    'ConfirmPrompt.prompt'() {
      return true
    },
  })
  const result = await confirmDelete([
    { depth: 0, name: 'file.txt', selected: false, type: DirentType.File, uri: 'remote-server://server-hash/home/test/file.txt' },
  ])
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['ConfirmPrompt.prompt', 'Are you sure you want to delete "/home/test/file.txt"?', undefined]])
})

test('confirmDelete - malformed remote uri falls back to the original uri', async () => {
  using mockRpc = DialogWorker.registerMockRpc({
    'ConfirmPrompt.prompt'() {
      return true
    },
  })
  const uri = 'remote-server://[invalid/home/test/file.txt'
  await confirmDelete([{ depth: 0, name: 'file.txt', selected: false, type: DirentType.File, uri }])
  expect(mockRpc.invocations).toEqual([['ConfirmPrompt.prompt', `Are you sure you want to delete "${uri}"?`, undefined]])
})

test('confirmDelete - multiple folders', async () => {
  using mockRpc = DialogWorker.registerMockRpc({
    'ConfirmPrompt.prompt'() {
      return false
    },
  })

  const result = await confirmDelete([
    { depth: 0, name: 'folder-1', selected: true, type: DirentType.Directory, uri: '/test/folder-1' },
    { depth: 0, name: 'folder-2', selected: true, type: DirentType.Directory, uri: '/test/folder-2' },
  ])
  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['ConfirmPrompt.prompt', 'Are you sure you want to delete "folder-1", "folder-2"?', undefined]])
})
