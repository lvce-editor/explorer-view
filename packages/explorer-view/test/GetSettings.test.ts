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
    sourceControlDecorations: true,
  })
  expect(mockRpc.invocations).toEqual([
    ['Preferences.get', 'explorer.useChevrons'],
    ['Preferences.get', 'explorer.confirmdelete'],
    ['Preferences.get', 'explorer.confirmpaste'],
    ['Preferences.get', 'explorer.sourceControlDecorations'],
  ])
})

test('getSettings - useChevrons false', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get'(settingName: string) {
      if (settingName === 'explorer.useChevrons') {
        return false
      }
      if (settingName === 'explorer.confirmdelete') {
        return true
      }
      if (settingName === 'explorer.sourceControlDecorations') {
        return false
      }
      return undefined
    },
  })
  const settings = await getSettings()
  expect(settings).toEqual({
    useChevrons: false,
    confirmDelete: false,
    confirmPaste: false,
    sourceControlDecorations: false,
  })
  expect(mockRpc.invocations).toEqual([
    ['Preferences.get', 'explorer.useChevrons'],
    ['Preferences.get', 'explorer.confirmdelete'],
    ['Preferences.get', 'explorer.confirmpaste'],
    ['Preferences.get', 'explorer.sourceControlDecorations'],
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
    sourceControlDecorations: true,
  })
  expect(mockRpc.invocations).toEqual([
    ['Preferences.get', 'explorer.useChevrons'],
    ['Preferences.get', 'explorer.confirmdelete'],
    ['Preferences.get', 'explorer.confirmpaste'],
    ['Preferences.get', 'explorer.sourceControlDecorations'],
  ])
})
