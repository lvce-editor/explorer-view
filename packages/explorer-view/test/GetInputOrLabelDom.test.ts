import { test, expect } from '@jest/globals'
import { getInputOrLabelDom } from '../src/parts/GetInputOrLabelDom/GetInputOrLabelDom.ts'
import { Div, Input } from '../src/parts/VirtualDomElements/VirtualDomElements.ts'
import { Label, InputBox, InputValidationError } from '../src/parts/ClassNames/ClassNames.ts'

test('getInputOrLabelDom - editing state', () => {
  const result = getInputOrLabelDom(true, false, 'test')
  expect(result).toHaveLength(1)
  expect(result[0].type).toBe(Input)
  expect(result[0].className).toBe(InputBox)
})

test('getInputOrLabelDom - non-editing state', () => {
  const result = getInputOrLabelDom(false, false, 'test')
  expect(result).toHaveLength(2)
  expect(result[0].type).toBe(Div)
  expect(result[0].className).toBe(Label)
  expect(result[1].type).toBe(12)
  expect(result[1].text).toBe('test')
})

test('getInputOrLabelDom - editing state with error', () => {
  const result = getInputOrLabelDom(true, true, 'test')
  expect(result).toHaveLength(1)
  expect(result[0].type).toBe(Input)
  expect(result[0].className).toBe(`${InputBox} ${InputValidationError}`)
})
