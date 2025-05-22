import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { renderEditingSelection } from '../src/parts/RenderEditingSelection/RenderEditingSelection.ts'
import { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import * as InputName from '../src/parts/InputName/InputName.ts'

test('renderEditingSelection', () => {
  const oldState: ExplorerState = createDefaultState()
  const newState: ExplorerState = {
    ...createDefaultState(),
    editingSelectionStart: 1,
    editingSelectionEnd: 6,
  }
  const result = renderEditingSelection(oldState, newState)
  expect(result).toEqual(['Viewlet.setSelectionByName', InputName.ExplorerInput, 1, 6])
})
