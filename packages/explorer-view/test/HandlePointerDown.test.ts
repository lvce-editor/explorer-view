import { test, expect } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'
import { handlePointerDown } from '../src/parts/HandlePointerDown/HandlePointerDown.ts'
import * as MouseEventType from '../src/parts/MouseEventType/MouseEventType.ts'

test('left click outside items', () => {
  const state = createDefaultState()
  const result = handlePointerDown(state, MouseEventType.LeftClick, 100, 100)
  expect(result).toEqual({
    ...state,
    focused: true,
    focusedIndex: -1,
    focus: FocusId.List,
    pointerDownIndex: -1,
  })
})

test.skip('right click outside items', () => {
  const state = createDefaultState()
  const result = handlePointerDown(state, 2, 100, 100)
  expect(result).toEqual({
    ...state,
    pointerDownIndex: -1,
  })
})

test('left click on item', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0, selected: false }],
  }
  const result = handlePointerDown(state, MouseEventType.LeftClick, 0, 0)
  expect(result).toEqual({
    ...state,
    pointerDownIndex: 0,
  })
})
