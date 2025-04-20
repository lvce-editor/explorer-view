import { test, expect } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleArrowLeft } from '../src/parts/HandleArrowLeft/HandleArrowLeft.ts'

test('handleArrowLeft - no focused item', () => {
  const state = { ...createDefaultState(), focusedIndex: -1 }
  const result = handleArrowLeft(state)
  expect(result).toBe(state)
})

test('handleArrowLeft - directory', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      {
        type: DirentType.Directory,
        name: 'test',
        path: '/test',
        expanded: false,
        level: 0,
        depth: 0,
      },
    ],
    focusedIndex: 0,
  }
  const result = handleArrowLeft(state)
  expect(result).toBeDefined()
})

test('handleArrowLeft - file', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      {
        type: DirentType.File,
        name: 'test.txt',
        path: '/test.txt',
        level: 0,
        depth: 0,
      },
    ],
    focusedIndex: 0,
  }
  const result = handleArrowLeft(state)
  expect(result).toBeDefined()
})

test('handleArrowLeft - symlink file', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      {
        type: DirentType.SymLinkFile,
        name: 'test.txt',
        path: '/test.txt',
        level: 0,
        depth: 0,
      },
    ],
    focusedIndex: 0,
  }
  const result = handleArrowLeft(state)
  expect(result).toBeDefined()
})

test('handleArrowLeft - expanded directory', () => {
  const state = {
    ...createDefaultState(),
    items: [
      {
        type: DirentType.DirectoryExpanded,
        name: 'test',
        path: '/test',
        expanded: true,
        level: 0,
        depth: 0,
      },
    ],
    focusedIndex: 0,
  }
  const result = handleArrowLeft(state)
  expect(result).toBeDefined()
})
