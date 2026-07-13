import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetTitle from '../src/parts/GetTitle/GetTitle.ts'

test('getTitle - returns workspace name', () => {
  const state = {
    ...createDefaultState(),
    root: '/home/test/project',
  }

  expect(GetTitle.getTitle(state)).toBe('project')
})

test('getTitle - returns explorer when no folder is open', () => {
  const state = {
    ...createDefaultState(),
    root: '',
  }

  expect(GetTitle.getTitle(state)).toBe('Explorer')
})

test('getTitle - ignores trailing separator', () => {
  const state = {
    ...createDefaultState(),
    root: '/home/test/project/',
  }

  expect(GetTitle.getTitle(state)).toBe('project')
})

test('getTitle - uses full root when path has no basename', () => {
  const state = {
    ...createDefaultState(),
    root: '/',
  }

  expect(GetTitle.getTitle(state)).toBe('/')
})
