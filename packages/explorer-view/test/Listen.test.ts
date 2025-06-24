import { test } from '@jest/globals'
import { listen } from '../src/parts/Listen/Listen.ts'
import { mockWorkerGlobalRpc } from '@lvce-editor/rpc'

test('listen', async () => {
  const { start, dispose } = mockWorkerGlobalRpc()
  const listenPromise = listen()
  start()
  await listenPromise
  dispose()
})
