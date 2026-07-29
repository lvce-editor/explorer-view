import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as ExplorerStates from '../src/parts/ExplorerStates/ExplorerStates.ts'
import * as Render2 from '../src/parts/Render2/Render2.ts'

test('render2 - recomputes a stale diff before rendering', () => {
  const uid = 1
  const staleDiffResult = [DiffType.RenderFocus]
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    items: [...oldState.items],
  }
  ExplorerStates.set(uid, oldState, newState)
  const result = Render2.render2(uid, staleDiffResult)
  expect(result).toEqual([['Viewlet.setPatches', 1, []]])
})
