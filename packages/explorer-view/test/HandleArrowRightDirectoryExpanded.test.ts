import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleArrowRightDirectoryExpanded } from '../src/parts/HandleArrowRightDirectoryExpanded/HandleArrowRightDirectoryExpanded.ts'

test.skip('handleArrowRightDirectoryExpanded - last item', () => {
  const state = createDefaultState()
  const dirent = { depth: 0 }
  const result = handleArrowRightDirectoryExpanded(state, dirent)
  expect(result).toBe(state)
})

test('handleArrowRightDirectoryExpanded - next item has higher depth', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { path: '/a', name: 'a', type: 1, depth: 0, selected: false },
      { path: '/b', name: 'b', type: 1, depth: 1, selected: false },
    ],
    focusedIndex: 0,
  }
  const dirent = { depth: 0 }
  const result = handleArrowRightDirectoryExpanded(state, dirent)
  expect(result.focusedIndex).toBe(1)
})

test('handleArrowRightDirectoryExpanded - next item has same depth', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { path: '/a', name: 'a', type: 1, depth: 0, selected: false },
      { path: '/b', name: 'b', type: 1, depth: 0, selected: false },
    ],
    focusedIndex: 0,
  }
  const dirent = { depth: 0 }
  const result = handleArrowRightDirectoryExpanded(state, dirent)
  expect(result).toBe(state)
})
