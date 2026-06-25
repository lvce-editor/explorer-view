import { expect, test } from '@jest/globals'
import { WhenExpression } from '@lvce-editor/constants'
import { KeyCode, KeyModifier } from '@lvce-editor/virtual-dom-worker'
import { getKeyBindings } from '../src/parts/GetKeyBindings/GetKeyBindings.ts'

test('getKeyBindings', () => {
  const keyBindings = getKeyBindings()
  expect(keyBindings).toBeDefined()
  expect(keyBindings).toContainEqual({
    command: 'Explorer.undo',
    key: KeyModifier.CtrlCmd | KeyCode.KeyZ,
    when: WhenExpression.FocusExplorer,
  })
})
