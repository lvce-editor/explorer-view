import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleScrollBarMove } from '../src/parts/HandleScrollBarMove/HandleScrollBarMove.ts'

const createScrollState = (): ExplorerState => ({
  ...createDefaultState(),
  handleOffset: 25,
  height: 500,
  itemHeight: 20,
  items: Array.from({ length: 50 }, (_, index) => ({
    depth: 0,
    name: `file-${index}.txt`,
    path: `/file-${index}.txt`,
    selected: false,
    type: 1,
  })),
  scrollBarActive: true,
  y: 10,
})

test('handleScrollBarMove - moves thumb with pointer', async () => {
  const state = createScrollState()

  const newState = await handleScrollBarMove(state, state.y + state.handleOffset + 125)

  expect(newState.deltaY).toBe(250)
})

test('handleScrollBarMove - clamps above track', async () => {
  const state = createScrollState()

  const newState = await handleScrollBarMove(state, 0)

  expect(newState.deltaY).toBe(0)
})

test('handleScrollBarMove - clamps below track', async () => {
  const state = createScrollState()

  const newState = await handleScrollBarMove(state, 1000)

  expect(newState.deltaY).toBe(500)
})

test('handleScrollBarMove - ignores pointer when inactive', async () => {
  const state = {
    ...createScrollState(),
    scrollBarActive: false,
  }

  const newState = await handleScrollBarMove(state, 300)

  expect(newState).toBe(state)
})
