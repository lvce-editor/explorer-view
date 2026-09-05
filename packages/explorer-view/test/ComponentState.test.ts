import { afterEach, expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { create } from '../src/parts/Create/Create.ts'
import * as ExplorerStates from '../src/parts/ExplorerStates/ExplorerStates.ts'
import { getComponentDom } from '../src/parts/GetComponentDom/GetComponentDom.ts'
import { getComponentState } from '../src/parts/GetComponentState/GetComponentState.ts'
import { setComponentState } from '../src/parts/SetComponentState/SetComponentState.ts'

afterEach(() => {
  ExplorerStates.clear()
})

const createState = (uid: number, focusedIndex: number): ExplorerState => ({
  ...create(uid, '', 0, 0, 200, 200, undefined, 0, 0, '', true),
  focusedIndex,
})

test('gets the current scheduled state', () => {
  const oldState = createState(1, 0)
  const newState = createState(1, 1)
  ExplorerStates.set(1, oldState, newState)

  expect(getComponentState(1)).toBe(newState)
})

test('sets state while preserving the previous rendered state for diffing', async () => {
  const oldState = createState(1, 0)
  const newState = createState(1, 2)
  ExplorerStates.set(1, oldState, oldState)

  await setComponentState(1, newState)

  expect(ExplorerStates.get(1)).toMatchObject({
    newState: { focusedIndex: 2, uid: 1 },
    oldState,
    scheduledState: { focusedIndex: 2, uid: 1 },
  })
})

test('rejects a changed uid', async () => {
  const oldState = createState(1, 0)
  ExplorerStates.set(1, oldState, oldState)

  await expect(setComponentState(1, createState(2, 0))).rejects.toThrow('Explorer state uid must remain 1')
})

test('rejects non-object state', async () => {
  const oldState = createState(1, 0)
  ExplorerStates.set(1, oldState, oldState)

  await expect(setComponentState(1, [] as unknown as ExplorerState)).rejects.toThrow('Explorer state must be an object')
})

test('inspects the current virtual DOM without advancing rendered state', () => {
  const uid = 104
  const oldState = { ...createState(uid, 0), uid }
  const newState = { ...oldState, initial: false }
  ExplorerStates.set(uid, oldState, newState)
  const before = ExplorerStates.get(uid)
  const dom = getComponentDom(uid)

  expect(Array.isArray(dom)).toBe(true)
  expect(dom.length).toBeGreaterThan(0)
  expect(dom[0]).toEqual(expect.objectContaining({ childCount: expect.any(Number), type: expect.any(Number) }))
  expect(ExplorerStates.get(uid)).toEqual(before)
  expect(ExplorerStates.get(uid).oldState).toBe(oldState)
  expect(ExplorerStates.get(uid).newState).toBe(newState)
})
