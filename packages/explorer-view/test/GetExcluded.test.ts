import { expect, test } from '@jest/globals'
import * as GetExcluded from '../src/parts/GetExcluded/GetExcluded.ts'

test('getExcluded - returns empty array for undefined', () => {
  expect(GetExcluded.getExcluded(undefined)).toEqual([])
})

test('getExcluded - returns enabled patterns', () => {
  expect(GetExcluded.getExcluded({ '**/.git': true, '**/.svn': false, '**/*.tmp': true })).toEqual(['**/.git', '**/*.tmp'])
})

test('getExcluded - ignores non-boolean truthy values', () => {
  expect(GetExcluded.getExcluded({ '**/*.js': { when: '$(basename).ts' }, '**/*.map': 1 })).toEqual([])
})

test('getExcluded - returns empty array for invalid values', () => {
  expect(GetExcluded.getExcluded(null)).toEqual([])
  expect(GetExcluded.getExcluded([])).toEqual([])
  expect(GetExcluded.getExcluded('**/.git')).toEqual([])
})
