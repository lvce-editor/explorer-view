import { beforeEach, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import * as InputSource from '../src/parts/InputSource/InputSource.ts'
 
import { updateEditingValue } from '../src/parts/UpdateEditingValue/UpdateEditingValue.ts'

const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  switch (method) {
    case 'IconTheme.getFileIcon':
      return `file-${params[0].name}`
    case 'IconTheme.getFolderIcon':
      return `folder-${params[0].name}`
    default:
      throw new Error(`unknown method ${method}`)
  }
}

beforeEach(async () => {
  RendererWorker.registerMockRpc({
    'IconTheme.getFileIcon': invoke.bind(undefined, 'IconTheme.getFileIcon'),
    'IconTheme.getFolderIcon': invoke.bind(undefined, 'IconTheme.getFolderIcon'),
  })
})

test('updateEditingValue - updates state with new value', async () => {
  const state: ExplorerState = createDefaultState()
  const newValue = 'new value'
  const result = await updateEditingValue(state, newValue)
  expect(result.editingValue).toBe(newValue)
  expect(result.editingIcon).toBe('')
})

test('updateEditingValue - updates state with new value and input source', async () => {
  const state: ExplorerState = createDefaultState()
  const newValue = 'new value'
  const result = await updateEditingValue(state, newValue, InputSource.User)
  expect(result.editingValue).toBe(newValue)
  expect(result.editingIcon).toBe('')
})

test('updateEditingValue - updates file icon', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    editingType: ExplorerEditingType.CreateFile,
  }
  const newValue = 'test.txt'
  const result = await updateEditingValue(state, newValue)
  expect(result.editingValue).toBe(newValue)
  expect(result.editingIcon).toBe('file-test.txt')
})

test('updateEditingValue - updates folder icon', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    editingType: ExplorerEditingType.CreateFolder,
  }
  const newValue = 'test'
  const result = await updateEditingValue(state, newValue)
  expect(result.editingValue).toBe(newValue)
  expect(result.editingIcon).toBe('folder-test')
})

test('updateEditingValue - updates file icon when renaming file', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    editingType: ExplorerEditingType.Rename,
    editingIndex: 0,
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0, selected: false }],
  }
  const newValue = 'new.txt'
  const result = await updateEditingValue(state, newValue)
  expect(result.editingValue).toBe(newValue)
  expect(result.editingIcon).toBe('file-new.txt')
})

test('updateEditingValue - updates folder icon when renaming folder', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    editingType: ExplorerEditingType.Rename,
    editingIndex: 0,
    items: [{ name: 'test', type: DirentType.Directory, path: '/test', depth: 0, selected: false }],
  }
  const newValue = 'new'
  const result = await updateEditingValue(state, newValue)
  expect(result.editingValue).toBe(newValue)
  expect(result.editingIcon).toBe('folder-new')
})

test('updateEditingValue - preserves other state properties', async () => {
  const state: ExplorerState = createDefaultState()
  const result = await updateEditingValue(state, 'new value')
  expect(result.uid).toBe(state.uid)
  expect(result.root).toBe(state.root)
  expect(result.items).toBe(state.items)
})
