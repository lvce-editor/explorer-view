import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as RpcRegistry from '@lvce-editor/rpc-registry'
import { getSettings } from '../src/parts/GetSettings/GetSettings.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'

const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  if (method === 'Preferences.get') {
    return params[1]
  }
  throw new Error(`Unexpected method: ${method}`)
}

const mockRpc = await MockRpc.create({
  invoke,
  commandMap: {},
})

test('getSettings - useChevrons true', async () => {
  RpcRegistry.set(RendererWorker, mockRpc)
  const settings = await getSettings()
  expect(settings).toEqual({
    useChevrons: true,
  })
})

test.skip('getSettings - useChevrons false', async () => {
  RpcRegistry.set(RendererWorker, mockRpc)
  const settings = await getSettings()
  expect(settings).toEqual({
    useChevrons: false,
  })
})

test('getSettings - useChevrons undefined', async () => {
  RpcRegistry.set(RendererWorker, mockRpc)
  const settings = await getSettings()
  expect(settings).toEqual({
    useChevrons: true,
  })
})
