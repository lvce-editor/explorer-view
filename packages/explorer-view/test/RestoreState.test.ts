import { test, expect } from '@jest/globals'
import { restoreState } from '../src/parts/RestoreState/RestoreState.ts'

test('restoreState returns default state when savedState is null', () => {
  const result = restoreState(null)
  expect(result).toEqual({
    root: '',
    minLineY: 0,
    deltaY: 0,
  })
})

test('restoreState returns default state when savedState is undefined', () => {
  const result = restoreState(undefined)
  expect(result).toEqual({
    root: '',
    minLineY: 0,
    deltaY: 0,
  })
})

test('restoreState returns correct state with valid input', () => {
  const savedState = {
    workspacePath: '/test/path',
    minLineY: 100,
    deltaY: 50,
  }
  const result = restoreState(savedState)
  expect(result).toEqual({
    root: '/test/path',
    minLineY: 100,
    deltaY: 50,
  })
})

test('restoreState handles partial state with missing properties', () => {
  const savedState = {
    workspacePath: '/test/path',
  }
  const result = restoreState(savedState)
  expect(result).toEqual({
    root: '/test/path',
    minLineY: 0,
    deltaY: 0,
  })
})

test('restoreState handles invalid property types', () => {
  const savedState = {
    workspacePath: 123,
    minLineY: '100',
    deltaY: true,
  }
  const result = restoreState(savedState)
  expect(result).toEqual({
    root: '',
    minLineY: 0,
    deltaY: 0,
  })
})

test('restoreState handles non-object input', () => {
  const result = restoreState('invalid')
  expect(result).toEqual({
    root: '',
    minLineY: 0,
    deltaY: 0,
  })
})
