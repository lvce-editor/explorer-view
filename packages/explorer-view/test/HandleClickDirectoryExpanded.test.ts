import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleClickDirectoryExpanded } from '../src/parts/HandleClickDirectoryExpanded/HandleClickDirectoryExpanded.ts'

test.skip('collapse expanded directory', async () => {
  const state = createDefaultState()
  const dirent = {
    name: 'test',
    type: DirentType.Directory,
    path: '/test',
    depth: 0,
  }
  const index = 0
  const keepFocus = true

  const newState = await handleClickDirectoryExpanded(state, dirent, index, keepFocus)

  expect(newState.items).toHaveLength(1)
  expect(newState.focusedIndex).toBe(0)
  expect(newState.focused).toBe(true)
})

test('collapse expanded directory with children', async () => {
  const dirent = {
    name: 'test',
    type: DirentType.Directory,
    path: '/test',
    depth: 0,
  }
  const child1 = {
    name: 'child1',
    type: DirentType.File,
    path: '/test/child1',
    depth: 1,
  }
  const child2 = {
    name: 'child2',
    type: DirentType.File,
    path: '/test/child2',
    depth: 1,
  }
  const state = {
    ...createDefaultState(),
    items: [dirent, child1, child2],
  }
  const index = 0
  const keepFocus = true

  const newState = await handleClickDirectoryExpanded(state, dirent, index, keepFocus)

  expect(newState.items).toHaveLength(1)
  expect(newState.focusedIndex).toBe(0)
  expect(newState.focused).toBe(true)
})
