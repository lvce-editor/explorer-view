import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.js'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.js'
import { renameDirent } from '../src/parts/RenameDirent/RenameDirent.js'

test('renameDirent updates state with editing properties', () => {
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0 }],
  }

  const result = renameDirent(mockState)
  expect(result).toEqual({
    ...mockState,
    editingIndex: 0,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'test.txt',
  })
})

test.skip('renameDirent handles empty state', () => {
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    items: [],
  }

  const result = renameDirent(mockState)
  expect(result).toEqual({
    ...mockState,
    editingIndex: -1,
    editingType: ExplorerEditingType.Rename,
    editingValue: '',
  })
})
