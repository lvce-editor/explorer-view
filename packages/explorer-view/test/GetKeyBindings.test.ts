import { expect, test } from '@jest/globals'
import { WhenExpression } from '@lvce-editor/constants'
import { KeyCode } from '@lvce-editor/virtual-dom-worker'
import { getKeyBindings } from '../src/parts/GetKeyBindings/GetKeyBindings.ts'

test('getKeyBindings', () => {
  const keyBindings = getKeyBindings()
  expect(keyBindings).toBeDefined()
})

test('registers one explorer Escape keybinding', () => {
  const keyBindings = getKeyBindings()
  const escapeKeyBindings = keyBindings.filter(({ key, when }) => key === KeyCode.Escape && when === WhenExpression.FocusExplorer)

  expect(escapeKeyBindings).toEqual([
    {
      command: 'Explorer.handleEscape',
      key: KeyCode.Escape,
      when: WhenExpression.FocusExplorer,
    },
  ])
})

test('registers Space to open the focused item without moving focus', () => {
  const keyBindings = getKeyBindings()
  const spaceKeyBindings = keyBindings.filter(({ key, when }) => key === KeyCode.Space && when === WhenExpression.FocusExplorer)

  expect(spaceKeyBindings).toEqual([
    {
      command: 'Explorer.handleClickCurrentButKeepFocus',
      key: KeyCode.Space,
      when: WhenExpression.FocusExplorer,
    },
  ])
})
