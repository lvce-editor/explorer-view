import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { openInIntegratedTerminal } from '../src/parts/OpenInIntegratedTerminal/OpenInIntegratedTerminal.ts'

test('opens a terminal in the focused directory', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.openIntegratedTerminal'() {},
  })
  const state = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'folder', selected: true, type: DirentType.Directory, uri: 'file:///workspace/folder' }],
  }

  await expect(openInIntegratedTerminal(state)).resolves.toBe(state)
  expect(mockRpc.invocations).toEqual([['Layout.openIntegratedTerminal', 'file:///workspace/folder']])
})

test('opens a terminal in the parent of the focused file', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.openIntegratedTerminal'() {},
  })
  const state = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'file.txt', selected: true, type: DirentType.File, uri: 'file:///workspace/folder/file.txt' }],
  }

  await openInIntegratedTerminal(state)

  expect(mockRpc.invocations).toEqual([['Layout.openIntegratedTerminal', 'file:///workspace/folder']])
})

test('opens a terminal in the workspace root when no item is focused', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.openIntegratedTerminal'() {},
  })
  const state = {
    ...createDefaultState(),
    focusedIndex: -1,
    root: 'file:///workspace',
  }

  await openInIntegratedTerminal(state)

  expect(mockRpc.invocations).toEqual([['Layout.openIntegratedTerminal', 'file:///workspace']])
})
