import { expect, test } from '@jest/globals'
import * as MergeClassNames from '../src/parts/MergeClassNames/MergeClassNames.ts'

test('mergeClassNames - single class', () => {
  expect(MergeClassNames.mergeClassNames('Button')).toBe('Button')
})

test('mergeClassNames - multiple classes', () => {
  expect(MergeClassNames.mergeClassNames('Button', 'Primary', 'Large')).toBe('Button Primary Large')
})

test('mergeClassNames - with empty strings', () => {
  expect(MergeClassNames.mergeClassNames('Button', '', 'Primary')).toBe('Button Primary')
})

test('mergeClassNames - no arguments', () => {
  expect(MergeClassNames.mergeClassNames()).toBe('')
})
