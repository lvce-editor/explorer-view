import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { renderEditingSelection } from '../src/parts/RenderEditingSelection/RenderEditingSelection.ts'

test('renderEditingSelection', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    editingSelection: { start: 1, end: 6 },
  }
  const result = renderEditingSelection(oldState, newState)
  expect(result).toEqual(['Viewlet.setSelection', { start: 1, end: 6 }])
})
