import { test, expect } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleArrowLeft } from '../src/parts/HandleArrowLeft/HandleArrowLeft.ts'

test('handleArrowLeft - no focused item', () => {
  const state: ExplorerState = { ...createDefaultState(), focusedIndex: -1 }
  const result = handleArrowLeft(state)
  expect(result).toBe(state)
})

test('handleArrowLeft - directory', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      {
        depth: 0,
        name: 'test',
        selected: false,
        type: DirentType.Directory,
        uri: '/test',
      },
    ],
  }
  const result = handleArrowLeft(state)
  expect(result).toBeDefined()
})

test('handleArrowLeft - file', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      {
        depth: 0,
        name: 'test.txt',
        selected: false,
        type: DirentType.File,
        uri: '/test.txt',
      },
    ],
  }
  const result = handleArrowLeft(state)
  expect(result).toBeDefined()
})

test('handleArrowLeft - symlink file', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      {
        depth: 0,
        name: 'test.txt',
        selected: false,
        type: DirentType.SymLinkFile,
        uri: '/test.txt',
      },
    ],
  }
  const result = handleArrowLeft(state)
  expect(result).toBeDefined()
})

test('handleArrowLeft - expanded directory', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      {
        depth: 0,
        // @ts-ignore
        expanded: true,
        level: 0,
        name: 'test',
        selected: false,
        type: DirentType.DirectoryExpanded,
        uri: '/test',
      },
    ],
  }
  const result = handleArrowLeft(state)
  expect(result).toBeDefined()
})

test('handleArrowLeft - expanding directory', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      {
        depth: 0,
        name: 'test',
        selected: false,
        type: DirentType.DirectoryExpanding,
        uri: '/test',
      },
    ],
  }
  const result = handleArrowLeft(state)
  expect(result).toBeDefined()
})

test('handleArrowLeft - symlink folder', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      {
        depth: 0,
        name: 'test',
        selected: false,
        type: DirentType.SymLinkFolder,
        uri: '/test',
      },
    ],
  }
  const result = handleArrowLeft(state)
  expect(result).toBeDefined()
})
