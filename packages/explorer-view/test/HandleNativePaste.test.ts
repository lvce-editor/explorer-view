import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleNativePaste } from '../src/parts/HandleNativePaste/HandleNativePaste.ts'
import * as NativeFileTypes from '../src/parts/NativeFileTypes/NativeFileTypes.ts'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.ts'

test('copies a native Electron file into the focused workspace folder', async () => {
  using rendererRpc = RendererWorker.registerMockRpc({
    'FileHandles.get'() {
      return [{ kind: 'file-legacy', path: '/home/test/Main.elm', value: new File(['content'], 'Main.elm') }]
    },
    'FileSystem.copy'() {},
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === '/workspace/src') {
        return []
      }
      return [{ name: 'src', type: DirentType.Directory }]
    },
    'IconTheme.getIcons'() {
      return ['']
    },
    'Preferences.get'() {
      return false
    },
  })
  const state = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'src', path: '/workspace/src', selected: false, type: DirentType.Directory }],
    platform: PlatformType.Electron,
    root: '/workspace',
  }

  await handleNativePaste(state, [41])

  expect(rendererRpc.invocations).toEqual([
    ['FileHandles.get', [41]],
    ['FileSystem.readDirWithFileTypes', '/workspace/src'],
    ['FileSystem.copy', '/home/test/Main.elm', '/workspace/src/Main.elm'],
    ['FileSystem.readDirWithFileTypes', '/workspace'],
  ])
})

test('falls back to the internal clipboard when the paste event has no files', async () => {
  using rendererRpc = RendererWorker.registerMockRpc({
    'ClipBoard.readNativeFiles'() {
      return { files: [], type: NativeFileTypes.None }
    },
  })
  const state = createDefaultState()

  const result = await handleNativePaste(state, [])

  expect(result).toBe(state)
  expect(rendererRpc.invocations).toEqual([['ClipBoard.readNativeFiles']])
})

test('does not paste native files into a readonly workspace', async () => {
  const state = { ...createDefaultState(), isReadonly: true }

  await expect(handleNativePaste(state, [41])).resolves.toBe(state)
})

test('wraps native clipboard resolution errors', async () => {
  using _rendererRpc = RendererWorker.registerMockRpc({
    'FileHandles.get'() {
      throw new Error('native path unavailable')
    },
  })
  const state = { ...createDefaultState(), platform: PlatformType.Electron }

  await expect(handleNativePaste(state, [41])).rejects.toThrow('Failed to paste native files: native path unavailable')
})
