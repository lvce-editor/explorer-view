import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { confirmDelete } from '../src/parts/ConfirmDelete/ConfirmDelete.ts'

test('confirmDelete - single file', async () => {
  RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt'() {
      return true
    },
  })
  const result = await confirmDelete(['/test/file.txt'])
  expect(result).toBe(true)
})

test('confirmDelete - multiple files', async () => {
  RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt'() {
      return false
    },
  })

  const result = await confirmDelete(['/test/file1.txt', '/test/file2.txt', '/test/file3.txt'])
  expect(result).toBe(false)
})
