import { test, expect } from '@jest/globals'
import { Label, LabelCut, InputValidationError } from '../src/parts/ClassNames/ClassNames.ts'
import { getInputOrLabelDom } from '../src/parts/GetInputOrLabelDom/GetInputOrLabelDom.ts'
import { Div, Input } from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getInputOrLabelDom - editing state', () => {
  const result = getInputOrLabelDom(true, false, 'test', false, false)
  expect(result).toHaveLength(1)
  expect(result[0].type).toBe(Input)
  expect(result[0].className).toBe(`ExplorerInputBox`)
})

test('getInputOrLabelDom - non-editing state', () => {
  const result = getInputOrLabelDom(false, false, 'test', false, false)
  expect(result).toHaveLength(2)
  expect(result[0].type).toBe(Div)
  expect(result[0].className).toBe(Label)
  expect(result[1].type).toBe(12)
  expect(result[1].text).toBe('test')
})

test('getInputOrLabelDom - editing state with error', () => {
  const result = getInputOrLabelDom(true, true, 'test', false, false)
  expect(result).toHaveLength(1)
  expect(result[0].type).toBe(Input)
  expect(result[0].className).toBe(`ExplorerInputBox ${InputValidationError}`)
})

test('getInputOrLabelDom - ignored item is dimmed', () => {
  const result = getInputOrLabelDom(false, false, 'test', false, true)
  expect(result).toHaveLength(2)
  expect(result[0].type).toBe(Div)
  expect(result[0].className).toBe(`${Label} ${LabelCut}`)
  expect(result[1].type).toBe(12)
  expect(result[1].text).toBe('test')
})
