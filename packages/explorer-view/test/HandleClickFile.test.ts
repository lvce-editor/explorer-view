import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import * as CommandCompletion from '../src/parts/CommandCompletion/CommandCompletion.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleClickFile } from '../src/parts/HandleClickFile/HandleClickFile.ts'

const file: ExplorerItem = {
  depth: 0,
  name: 'file.txt',
  path: 'file:///file.txt',
  selected: false,
  type: DirentType.File,
}

const state: ExplorerState = {
  ...createDefaultState(),
  uid: 42,
}

test('opens file with editor focus', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Editor.handleBlur'() {},
    'Editor.handleFocus'() {},
    'GetActiveEditor.getActiveEditorId'() {
      return 84
    },
    'Main.openInput'() {},
  })

  const newState = await handleClickFile(state, file, 0)
  const completion = CommandCompletion.take(newState)
  expect(completion).toBeDefined()
  await completion
  expect(newState.focused).toBe(false)
  expect(mockRpc.invocations).toEqual([
    [
      'Main.openInput',
      {
        editorInput: {
          type: 'editor',
          uri: 'file:///file.txt',
        },
        focus: true,
        preview: true,
      },
    ],
    ['GetActiveEditor.getActiveEditorId'],
    ['Editor.handleBlur', 84],
    ['Editor.handleFocus', 84],
  ])
})

test('keeps explorer focused after opening file', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.openInput'() {},
  })

  const newState = await handleClickFile(state, file, 0, true)
  const completion = CommandCompletion.take(newState)
  expect(completion).toBeDefined()
  await completion
  expect(newState.focused).toBe(true)
  expect(mockRpc.invocations).toEqual([
    [
      'Main.openInput',
      {
        editorInput: {
          type: 'editor',
          uri: 'file:///file.txt',
        },
        focus: false,
        preview: true,
      },
    ],
  ])
})

test('falls back to main focus when editor focus fails', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Editor.handleBlur'() {},
    'Editor.handleFocus'() {
      throw new Error('editor focus failed')
    },
    'GetActiveEditor.getActiveEditorId'() {
      return 84
    },
    'Main.focus'() {},
    'Main.openInput'() {},
  })

  const newState = await handleClickFile(state, file, 0)
  const completion = CommandCompletion.take(newState)
  expect(completion).toBeDefined()
  await completion
  expect(mockRpc.invocations.slice(-4)).toEqual([
    ['GetActiveEditor.getActiveEditorId'],
    ['Editor.handleBlur', 84],
    ['Editor.handleFocus', 84],
    ['Main.focus'],
  ])
})
