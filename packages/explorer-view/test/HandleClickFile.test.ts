import { expect, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import * as CommandCompletion from '../src/parts/CommandCompletion/CommandCompletion.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleClickFile } from '../src/parts/HandleClickFile/HandleClickFile.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

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

test('focuses editor after opening file', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.focus'() {},
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
  ])
  await new Promise((resolve) => setTimeout(resolve, 0))
  expect(mockRpc.invocations.at(-1)).toEqual(['Main.focus'])
})

test('keeps explorer focused after opening file', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.focus'() {},
    'Main.openInput'() {},
  })

  const newState = await handleClickFile(state, file, 0, true)
  const completion = CommandCompletion.take(newState)
  expect(completion).toBeDefined()
  await completion
  await new Promise((resolve) => setTimeout(resolve, 0))
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

test('requests editor focus only after opening file', async () => {
  const editorOpened = Promise.withResolvers<void>()
  using _mockRpc = RendererWorker.registerMockRpc({
    async 'Main.openInput'() {
      await editorOpened.promise
    },
  })
  RendererProcess.set(createMockRpc({ commandMap: {} }))

  const newState = await handleClickFile(state, file, 0)
  const completion = CommandCompletion.take(newState)
  expect(completion).toBeDefined()
  expect(RendererProcess.takePostRenderFocus(42)).toBe(false)
  editorOpened.resolve()
  await completion
  expect(RendererProcess.takePostRenderFocus(42)).toBe(true)
})
