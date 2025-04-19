import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ExplorerStates from '../src/parts/ExplorerStates/ExplorerStates.ts'
import { wrapCommand } from '../src/parts/WrapCommand/WrapCommand.ts'

const fn1 = async (state: ExplorerState): Promise<ExplorerState> => {
  return { ...state, deltaY: 1 }
}

test('wrapCommand should update state when function returns new state', async () => {
  const uid = 123
  const oldState = createDefaultState()
  const newState: ExplorerState = { ...oldState, deltaY: 1 }

  ExplorerStates.set(uid, oldState, oldState)

  const wrapped = wrapCommand(fn1)
  await wrapped(uid)

  const { newState: currentState } = ExplorerStates.get(uid)
  expect(currentState).toEqual(newState)
})

const fn2 = async (state: ExplorerState): Promise<ExplorerState> => state

test('wrapCommand should not update state when function returns same state', async () => {
  const uid = 123
  const state = createDefaultState()

  ExplorerStates.set(uid, state, state)

  const wrapped = wrapCommand(fn2)
  await wrapped(uid)

  const { newState: currentState } = ExplorerStates.get(uid)
  expect(currentState).toEqual(state)
})
