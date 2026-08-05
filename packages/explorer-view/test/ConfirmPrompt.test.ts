import { expect, test } from '@jest/globals'
import { DialogWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { confirm } from '../src/parts/ConfirmPrompt/ConfirmPrompt.ts'

test('confirm - dialog worker', async () => {
  using dialogRpc = DialogWorker.registerMockRpc({
    'ConfirmPrompt.prompt'() {
      return true
    },
  })

  expect(await confirm('Continue?')).toBe(true)
  expect(dialogRpc.invocations).toEqual([['ConfirmPrompt.prompt', 'Continue?', undefined]])
})

test('confirm - renderer worker fallback', async () => {
  using dialogRpc = DialogWorker.registerMockRpc({
    'ConfirmPrompt.prompt'() {
      throw new Error('Command "SendMessagePortToExtensionHostWorker.sendMessagePortToDialogWorker" not found (renderer worker)')
    },
  })
  using rendererRpc = RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt'() {
      return false
    },
  })

  expect(await confirm('Continue?')).toBe(false)
  expect(dialogRpc.invocations).toEqual([['ConfirmPrompt.prompt', 'Continue?', undefined]])
  expect(rendererRpc.invocations).toEqual([['ConfirmPrompt.prompt', 'Continue?', undefined]])
})

test('confirm - unexpected error', async () => {
  using _dialogRpc = DialogWorker.registerMockRpc({
    'ConfirmPrompt.prompt'() {
      throw new Error('unexpected error')
    },
  })

  await expect(confirm('Continue?')).rejects.toThrow('unexpected error')
})
