import { expect, test } from '@jest/globals'
import { isExcluded } from '../src/parts/IsExcluded/IsExcluded.ts'

test('isExcluded - matches a top-level excluded folder', () => {
  expect(isExcluded('/workspace', '/workspace/.git', ['**/.git'])).toBe(true)
})

test('isExcluded - matches a nested excluded folder', () => {
  expect(isExcluded('/workspace', '/workspace/packages/app/.git', ['**/.git'])).toBe(true)
})

test('isExcluded - matches descendants of an excluded folder', () => {
  expect(isExcluded('/workspace', '/workspace/packages/app/.git/config', ['**/.git'])).toBe(true)
})

test('isExcluded - uses paths relative to the workspace root', () => {
  expect(isExcluded('/workspace', '/workspace/src/generated', ['src/generated'])).toBe(true)
  expect(isExcluded('/workspace', '/workspace/packages/src/generated', ['src/generated'])).toBe(false)
})

test('isExcluded - supports Windows separators', () => {
  expect(isExcluded('C:\\workspace', 'C:\\workspace\\nested\\.git', ['**/.git'])).toBe(true)
})
