import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { getSettings } from '../src/parts/GetSettings/GetSettings.ts'

test('getSettings - useChevrons true', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get'() {
      return undefined
    },
  })
  const settings = await getSettings()
  expect(settings).toEqual({
    useChevrons: true,
    confirmDelete: false,
    confirmPaste: false,
  })
  expect(mockRpc.invocations).toEqual([
    ['Preferences.get', 'explorer.useChevrons'],
    ['Preferences.get', 'explorer.confirmdelete'],
    ['Preferences.get', 'explorer.confirmpaste'],
  ])
})

test.skip('getSettings - useChevrons false', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get'(settingName: string) {
      if (settingName === 'explorer.useChevrons') {
        return false
      }
      if (settingName === 'explorer.confirmdelete') {
        return true
      }
      return undefined
    },
  })
  const settings = await getSettings()
  expect(settings).toEqual({
    useChevrons: false,
    confirmDelete: true,
    confirmPaste: false,
  })
  expect(mockRpc.invocations).toEqual([
    ['Preferences.get', 'explorer.useChevrons'],
    ['Preferences.get', 'explorer.confirmdelete'],
    ['Preferences.get', 'explorer.confirmpaste'],
  ])
})

test('getSettings - useChevrons undefined', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get'() {
      return undefined
    },
  })
  const settings = await getSettings()
  expect(settings).toEqual({
    useChevrons: true,
    confirmDelete: false,
    confirmPaste: false,
  })
  expect(mockRpc.invocations).toEqual([
    ['Preferences.get', 'explorer.useChevrons'],
    ['Preferences.get', 'explorer.confirmdelete'],
    ['Preferences.get', 'explorer.confirmpaste'],
  ])
})
