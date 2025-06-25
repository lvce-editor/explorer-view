import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { set } from '../src/parts/ExplorerStates/ExplorerStates.ts'
import { getMenuEntries2 } from '../src/parts/GetMenuEntries2/GetMenuEntries2.ts'

test('getMenuEntries2 - root', () => {
  const uid = 1
  const state: ExplorerState = createDefaultState()
  set(uid, state, state)
  const menuEntries = getMenuEntries2(uid)
  expect(menuEntries.length).toBeGreaterThan(0)
})

test('getMenuEntries2 - directory', () => {
  const uid = 1
  const item: ExplorerItem = {
    type: DirentType.Directory,
    name: 'test',
    path: '/test',
    depth: 0,
    selected: true,
  }
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [item],
    focusedIndex: 0,
  }
  set(uid, state, state)
  const menuEntries = getMenuEntries2(uid)
  expect(menuEntries.length).toBeGreaterThan(0)
})

test('getMenuEntries2 - file', () => {
  const uid = 1
  const item: ExplorerItem = {
    type: DirentType.File,
    name: 'test.txt',
    path: '/test.txt',
    depth: 0,
    selected: false,
  }
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [item],
    focusedIndex: 0,
  }
  set(uid, state, state)
  const menuEntries = getMenuEntries2(uid)
  expect(menuEntries.length).toBeGreaterThan(0)
})
