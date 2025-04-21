import { expect, test, beforeEach } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as InputSource from '../src/parts/InputSource/InputSource.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'
import { updateEditingValue } from '../src/parts/UpdateEditingValue/UpdateEditingValue.ts'
import { MockRpc } from '@lvce-editor/rpc'
import { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'

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

const mockRpc = await MockRpc.create({
  commandMap: {},
  invoke,
})

beforeEach(() => {
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
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

test.skip('updateEditingValue - updates file icon', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    editingType: DirentType.EditingFile,
  }
  const newValue = 'test.txt'
  const result = await updateEditingValue(state, newValue)
  expect(result.editingValue).toBe(newValue)
  expect(result.editingIcon).toBe('file-test.txt')
})

test.skip('updateEditingValue - updates folder icon', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    editingType: DirentType.EditingFolder,
  }
  const newValue = 'test'
  const result = await updateEditingValue(state, newValue)
  expect(result.editingValue).toBe(newValue)
  expect(result.editingIcon).toBe('folder-test')
})

test.skip('updateEditingValue - preserves other state properties', async () => {
  const state: ExplorerState = createDefaultState()
  const result = await updateEditingValue(state, 'new value')
  expect(result.uid).toBe(state.uid)
  expect(result.root).toBe(state.root)
  expect(result.items).toBe(state.items)
})
