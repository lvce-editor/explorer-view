import { test } from '@jest/globals'
import { main } from '../src/parts/Main/Main.ts'
import { mockWorkerGlobalRpc } from '@lvce-editor/rpc'

test('listen', async () => {
  const { start, dispose } = mockWorkerGlobalRpc()
  const mainPromise = main()
  start()
  await mainPromise
  dispose()
})
