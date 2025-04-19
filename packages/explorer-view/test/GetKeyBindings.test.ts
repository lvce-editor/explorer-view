import { test, expect } from '@jest/globals'
import { getKeyBindings } from '../src/parts/GetKeyBindings/GetKeyBindings.ts'
import * as KeyCode from '../src/parts/KeyCode/KeyCode.ts'
import * as KeyModifier from '../src/parts/KeyModifier/KeyModifier.ts'
import * as WhenExpression from '../src/parts/WhenExpression/WhenExpression.ts'

test('getKeyBindings', () => {
  const keyBindings = getKeyBindings()
  expect(keyBindings).toBeDefined()
  expect(Array.isArray(keyBindings)).toBe(true)
  expect(keyBindings.length).toBeGreaterThan(0)

  const rightArrowBinding = keyBindings.find((binding) => binding.key === KeyCode.RightArrow)
  expect(rightArrowBinding).toBeDefined()
  expect(rightArrowBinding?.command).toBe('Explorer.handleArrowRight')
  expect(rightArrowBinding?.when).toBe(WhenExpression.FocusExplorer)

  const ctrlVBinding = keyBindings.find((binding) => binding.key === (KeyModifier.CtrlCmd | KeyCode.KeyV))
  expect(ctrlVBinding).toBeDefined()
  expect(ctrlVBinding?.command).toBe('Explorer.handlePaste')
  expect(ctrlVBinding?.when).toBe(WhenExpression.FocusExplorer)

  const escapeBinding = keyBindings.find((binding) => binding.key === KeyCode.Escape && binding.when === WhenExpression.FocusExplorer)
  expect(escapeBinding).toBeDefined()
  expect(escapeBinding?.command).toBe('Explorer.focusNone')
})
