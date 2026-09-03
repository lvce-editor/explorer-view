import { afterEach, expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import * as ExplorerStates from '../src/parts/ExplorerStates/ExplorerStates.ts'
import { getComponentState } from '../src/parts/GetComponentState/GetComponentState.ts'
import { setComponentState } from '../src/parts/SetComponentState/SetComponentState.ts'

afterEach(() => {
  ExplorerStates.clear()
})

const createState = (uid: number, focusedIndex: number): ExplorerState => ({ focusedIndex, uid }) as ExplorerState

test('gets the current scheduled state', () => {
  const oldState = createState(1, 0)
  const newState = createState(1, 1)
  ExplorerStates.set(1, oldState, newState)

  expect(getComponentState(1)).toBe(newState)
})

test('sets state while preserving the previous rendered state for diffing', () => {
  const oldState = createState(1, 0)
  const newState = createState(1, 2)
  ExplorerStates.set(1, oldState, oldState)

  setComponentState(1, newState)

  expect(ExplorerStates.get(1)).toEqual({
    newState,
    oldState,
    scheduledState: newState,
  })
})

test('rejects a changed uid', () => {
  const oldState = createState(1, 0)
  ExplorerStates.set(1, oldState, oldState)

  expect(() => setComponentState(1, createState(2, 0))).toThrow('Explorer state uid must remain 1')
})

test('rejects non-object state', () => {
  expect(() => setComponentState(1, [] as unknown as ExplorerState)).toThrow('Explorer state must be an object')
})
