import { test, expect } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleClickAt } from '../src/parts/HandleClickAt/HandleClickAt.ts'
import { LeftClick } from '../src/parts/MouseEventType/MouseEventType.ts'

test.skip('handleClickAt - left click without shift', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 1, name: 'a', path: '/a', selected: false, type: 0 },
      { depth: 1, name: 'b', path: '/b', selected: false, type: 0 },
    ],
  }
  const result = await handleClickAt(state, false, LeftClick, false, false, 0, 0)
  expect(result).toBeDefined()
})

test('handleClickAt - shift click with no selection uses focused item as anchor', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 1, name: 'a', path: '/a', selected: false, type: 0 },
      { depth: 1, name: 'b', path: '/b', selected: false, type: 0 },
    ],
  }
  const result = await handleClickAt({ ...state, focusedIndex: 1, itemHeight: 20, maxLineY: 2 }, false, LeftClick, false, true, 0, 0)
  expect(result.items.map((item) => item.selected)).toEqual([true, true])
  expect(result.focusedIndex).toBe(0)
})

test('handleClickAt - shift click with existing selection selects the complete range', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 1, name: 'a', path: '/a', selected: true, type: 0 },
      { depth: 1, name: 'b', path: '/b', selected: false, type: 0 },
      { depth: 1, name: 'c', path: '/c', selected: false, type: 0 },
    ],
  }
  const result = await handleClickAt({ ...state, itemHeight: 20, maxLineY: 3 }, false, LeftClick, false, true, 0, 40)
  expect(result.items.map((item) => item.selected)).toEqual([true, true, true])
  expect(result.focusedIndex).toBe(2)
})

test('handleClickAt - non left click', async () => {
  const state: ExplorerState = createDefaultState()
  const shiftKey = false
  const ctrlKey = false
  const result = await handleClickAt(state, false, 2, ctrlKey, shiftKey, 0, 0)
  expect(result).toBe(state)
})

test('handleClickAt - left click', async () => {
  const state: ExplorerState = createDefaultState()
  const shiftKey = false
  const ctrlKey = false
  const result = await handleClickAt(state, false, LeftClick, ctrlKey, shiftKey, 0, 0)
  expect(result).toBeDefined()
})
