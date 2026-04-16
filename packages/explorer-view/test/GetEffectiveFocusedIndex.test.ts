import { expect, test } from '@jest/globals'
import { getEffectiveFocusedIndex } from '../src/parts/GetEffectiveFocusedIndex/GetEffectiveFocusedIndex.ts'

test('getEffectiveFocusedIndex - uses pending index when focused index is cleared', () => {
  expect(getEffectiveFocusedIndex(-1, 3)).toBe(3)
})

test('getEffectiveFocusedIndex - falls back to real focused index without pending focus', () => {
  expect(getEffectiveFocusedIndex(2, -1)).toBe(2)
})

test('getEffectiveFocusedIndex - pending focus overrides stale focused index', () => {
  expect(getEffectiveFocusedIndex(2, 3)).toBe(3)
})
