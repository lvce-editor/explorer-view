import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.js'
import { toggleIndividualSelection } from '../src/parts/ToggleIndividualSelection/ToggleIndividualSelection.js'

test('toggleIndividualSelection - toggles selection of item at valid index', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'file1', type: 0, path: '/file1', depth: 0, selected: false },
      { name: 'file2', type: 0, path: '/file2', depth: 0, selected: false },
      { name: 'file3', type: 0, path: '/file3', depth: 0, selected: false },
    ],
  }

  const newState = await toggleIndividualSelection(state, 1)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[2].selected).toBe(false)
})

test('toggleIndividualSelection - toggles selection from true to false', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'file1', type: 0, path: '/file1', depth: 0, selected: false },
      { name: 'file2', type: 0, path: '/file2', depth: 0, selected: true },
      { name: 'file3', type: 0, path: '/file3', depth: 0, selected: false },
    ],
  }

  const newState = await toggleIndividualSelection(state, 1)
  expect(newState.items[1].selected).toBe(false)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[2].selected).toBe(false)
})

test('toggleIndividualSelection - does nothing when index is negative', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'file1', type: 0, path: '/file1', depth: 0, selected: false },
      { name: 'file2', type: 0, path: '/file2', depth: 0, selected: false },
    ],
  }

  const newState = await toggleIndividualSelection(state, -1)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[1].selected).toBe(false)
})

test('toggleIndividualSelection - does nothing when index is out of range', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'file1', type: 0, path: '/file1', depth: 0, selected: false },
      { name: 'file2', type: 0, path: '/file2', depth: 0, selected: false },
    ],
  }

  const newState = await toggleIndividualSelection(state, 2)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[1].selected).toBe(false)
})

test('toggleIndividualSelection - preserves other selections', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'file1', type: 0, path: '/file1', depth: 0, selected: true },
      { name: 'file2', type: 0, path: '/file2', depth: 0, selected: false },
      { name: 'file3', type: 0, path: '/file3', depth: 0, selected: true },
    ],
  }

  const newState = await toggleIndividualSelection(state, 1)
  expect(newState.items[0].selected).toBe(true)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[2].selected).toBe(true)
})
