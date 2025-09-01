import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as RpcRegistry from '@lvce-editor/rpc-registry'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { getSettings } from '../src/parts/GetSettings/GetSettings.ts'

const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  if (method === 'Preferences.get') {
    const settingName = params[0]
    if (settingName === 'explorer.useChevrons') {
      return params[1]
    }
    if (settingName === 'explorer.confirmdelete') {
      return params[1]
    }
    return false
  }
  throw new Error(`Unexpected method: ${method}`)
}

const mockRpc = MockRpc.create({
  invoke,
  commandMap: {},
})

test('getSettings - useChevrons true', async () => {
  RpcRegistry.set(RendererWorker, mockRpc)
  const settings = await getSettings()
  expect(settings).toEqual({
    useChevrons: true,
    confirmDelete: false,
    confirmPaste: false,
  })
})

test.skip('getSettings - useChevrons false', async () => {
  RpcRegistry.set(RendererWorker, mockRpc)
  const settings = await getSettings()
  expect(settings).toEqual({
    useChevrons: false,
    confirmDelete: true,
    confirmPaste: false,
  })
})

test('getSettings - useChevrons undefined', async () => {
  RpcRegistry.set(RendererWorker, mockRpc)
  const settings = await getSettings()
  expect(settings).toEqual({
    useChevrons: true,
    confirmDelete: false,
    confirmPaste: false,
  })
})
