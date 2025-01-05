import { expect, test } from '@jest/globals'
import * as GetTreeItemIndent from '../src/parts/GetTreeItemIndent/GetTreeItemIndent.ts'

test('getTreeItemIndent - depth 0', () => {
  expect(GetTreeItemIndent.getTreeItemIndent(0)).toBe('0rem')
})

test('getTreeItemIndent - depth 1', () => {
  expect(GetTreeItemIndent.getTreeItemIndent(1)).toBe('1rem')
})

test('getTreeItemIndent - depth 2', () => {
  expect(GetTreeItemIndent.getTreeItemIndent(2)).toBe('2rem')
})

test('getTreeItemIndent - depth 3', () => {
  expect(GetTreeItemIndent.getTreeItemIndent(3)).toBe('3rem')
})
