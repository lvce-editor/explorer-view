import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleScrollBarClick } from '../src/parts/HandleScrollBarClick/HandleScrollBarClick.ts'

const createScrollState = (): ExplorerState => ({
  ...createDefaultState(),
  height: 500,
  itemHeight: 20,
  items: Array.from({ length: 50 }, (_, index) => ({
    depth: 0,
    name: `file-${index}.txt`,
    path: `/file-${index}.txt`,
    selected: false,
    type: 1,
  })),
  y: 10,
})

test('handleScrollBarClick - grabs existing thumb', async () => {
  const state = createScrollState()

  const newState = await handleScrollBarClick(state, state.y + 50)

  expect(newState.scrollBarActive).toBe(true)
  expect(newState.handleOffset).toBe(50)
  expect(newState.deltaY).toBe(0)
})

test('handleScrollBarClick - centers thumb at clicked position', async () => {
  const state = createScrollState()

  const newState = await handleScrollBarClick(state, state.y + 250)

  expect(newState.scrollBarActive).toBe(true)
  expect(newState.handleOffset).toBe(125)
  expect(newState.deltaY).toBe(250)
})

test('handleScrollBarClick - ignores click when no scrollbar is present', async () => {
  const state = {
    ...createScrollState(),
    items: [],
  }

  const newState = await handleScrollBarClick(state, 100)

  expect(newState).toBe(state)
})
