import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleClickAtRangeSelection } from '../src/parts/HandleClickAtRangeSelection/HandleClickAtRangeSelection.ts'

const createItem = (name: string, selected = false): ExplorerItem => ({
  depth: 1,
  name,
  path: `/${name}`,
  selected,
  type: 0,
})

const createState = (focusedIndex: number, selectedIndices: readonly number[] = []): ExplorerState => ({
  ...createDefaultState(),
  focusedIndex,
  items: ['a', 'b', 'c', 'd', 'e'].map((name, index) => createItem(name, selectedIndices.includes(index))),
})

const getSelectedIndices = (state: ExplorerState): readonly number[] => state.items.flatMap((item, index) => (item.selected ? [index] : []))

test('selects forward from the focused item when no multi-selection exists', async () => {
  const newState = await handleClickAtRangeSelection(createState(1), 4)

  expect(getSelectedIndices(newState)).toEqual([1, 2, 3, 4])
  expect(newState.focusedIndex).toBe(4)
})

test('selects backward from the focused item when no multi-selection exists', async () => {
  const newState = await handleClickAtRangeSelection(createState(3), 0)

  expect(getSelectedIndices(newState)).toEqual([0, 1, 2, 3])
  expect(newState.focusedIndex).toBe(0)
})

test('uses the first selected item as the range anchor', async () => {
  const newState = await handleClickAtRangeSelection(createState(4, [1]), 3)

  expect(getSelectedIndices(newState)).toEqual([1, 2, 3])
})

test('keeps selections outside the new range', async () => {
  const newState = await handleClickAtRangeSelection(createState(4, [1, 4]), 2)

  expect(getSelectedIndices(newState)).toEqual([1, 2, 4])
})

test('selects only the clicked item when it is the anchor', async () => {
  const newState = await handleClickAtRangeSelection(createState(2), 2)

  expect(getSelectedIndices(newState)).toEqual([2])
  expect(newState.focusedIndex).toBe(2)
})

test('selects only the clicked item when there is no anchor', async () => {
  const newState = await handleClickAtRangeSelection(createState(-1), 3)

  expect(getSelectedIndices(newState)).toEqual([3])
  expect(newState.focusedIndex).toBe(3)
})
