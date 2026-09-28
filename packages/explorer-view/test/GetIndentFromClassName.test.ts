import { expect, test } from '@jest/globals'
import { getIndentFromClassName } from '../src/parts/GetIndentFromClassName/GetIndentFromClassName.ts'

test('empty class name', () => {
  expect(getIndentFromClassName('')).toBe(0)
})

test('indent class', () => {
  expect(getIndentFromClassName('TreeItem Indent-34 TreeItemActive')).toBe(34)
})
