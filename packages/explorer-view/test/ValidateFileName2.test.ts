import { expect, test } from '@jest/globals'
import { validateFileName2 } from '../src/parts/ValidateFileName2/ValidateFileName2.ts'

test('validateFileName2 - empty', () => {
  expect(validateFileName2('')).toBe('A file or folder name must be provided.')
})

test('validateFileName2 - file cannot start with slash', () => {
  expect(validateFileName2('/')).toBe('A file or folder name cannot start with a slash.')
})

test('canBeDroppedInto - normal name', () => {
  expect(validateFileName2('abc')).toBe('')
})
