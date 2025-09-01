import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { confirmPaste } from '../src/parts/ConfirmPaste/ConfirmPaste.ts'

test('confirmPaste returns true when user confirms', async () => {
  RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt'() {
      return true
    },
  })
  const result = await confirmPaste()
  expect(result).toBe(true)
})

test('confirmPaste returns false when user cancels', async () => {
  RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt'() {
      return false
    },
  })
  const result = await confirmPaste()
  expect(result).toBe(false)
})
