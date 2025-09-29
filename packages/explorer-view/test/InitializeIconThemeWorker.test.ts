import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as InitializeIconThemeWorker from '../src/parts/InitializeIconThemeWorker/InitializeIconThemeWorker.ts'

test('initializeIconThemeWorker - success', async () => {
  RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToIconThemeWorker'() {
      return undefined
    },
  })

  await expect(InitializeIconThemeWorker.initializeIconThemeWorker()).resolves.toBeUndefined()
})

test('initializeIconThemeWorker - error handling', async () => {
  RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToIconThemeWorker'() {
      throw new Error('RPC creation failed')
    },
  })

  await expect(InitializeIconThemeWorker.initializeIconThemeWorker()).rejects.toThrow('Failed to create icon theme worker rpc')
})
