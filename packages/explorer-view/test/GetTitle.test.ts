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

test('getTitle - returns workspace name from uri', () => {
  const state = {
    ...createDefaultState(),
    pathSeparator: '\\',
    root: 'file:///home/test/project',
  }

  expect(GetTitle.getTitle(state)).toBe('project')
})

test('getTitle - decodes workspace name from uri', () => {
  const state = {
    ...createDefaultState(),
    root: 'file:///home/test/project%20name',
  }

  expect(GetTitle.getTitle(state)).toBe('project name')
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

test('getTitle - adds remote ssh host', () => {
  const state = {
    ...createDefaultState(),
    root: 'remote-ssh://example.com/home/test/project',
  }

  expect(GetTitle.getTitle(state)).toBe('project [SSH: example.com]')
})

test('getTitle - excludes remote ssh username and port', () => {
  const state = {
    ...createDefaultState(),
    root: 'remote-ssh://user@example.com:2222/home/test/project',
  }

  expect(GetTitle.getTitle(state)).toBe('project [SSH: example.com]')
})

test('getTitle - decodes remote ssh workspace name and ignores trailing slash', () => {
  const state = {
    ...createDefaultState(),
    root: 'remote-ssh://example.com/home/test/project%20name/',
  }

  expect(GetTitle.getTitle(state)).toBe('project name [SSH: example.com]')
})

test('getTitle - adds remote ssh host to remote root', () => {
  const state = {
    ...createDefaultState(),
    root: 'remote-ssh://example.com/',
  }

  expect(GetTitle.getTitle(state)).toBe('/ [SSH: example.com]')
})

test('getTitle - does not add remote ssh suffix when host is missing', () => {
  const state = {
    ...createDefaultState(),
    root: 'remote-ssh:///home/test/project',
  }

  expect(GetTitle.getTitle(state)).toBe('project')
})
