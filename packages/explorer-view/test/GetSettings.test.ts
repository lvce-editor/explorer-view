import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { getSettings } from '../src/parts/GetSettings/GetSettings.ts'

test('getSettings - useChevrons true', async () => {
  RendererWorker.registerMockRpc({
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
})

test.skip('getSettings - useChevrons false', async () => {
  RendererWorker.registerMockRpc({
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
})

test('getSettings - useChevrons undefined', async () => {
  RendererWorker.registerMockRpc({
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
})
