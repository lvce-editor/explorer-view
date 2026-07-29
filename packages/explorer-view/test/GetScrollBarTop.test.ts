import { expect, test } from '@jest/globals'
import { getScrollBarTop } from '../src/parts/GetScrollBarTop/GetScrollBarTop.ts'

test('getScrollBarTop - no scrollbar', () => {
  expect(getScrollBarTop(100, 100, 0, 0)).toBe(0)
})

test('getScrollBarTop - invalid content height', () => {
  expect(getScrollBarTop(100, NaN, 0, 0)).toBe(0)
})

test('getScrollBarTop - invalid scroll top', () => {
  expect(getScrollBarTop(100, 200, NaN, 50)).toBe(0)
})

test('getScrollBarTop - top', () => {
  expect(getScrollBarTop(100, 200, 0, 50)).toBe(0)
})

test('getScrollBarTop - middle', () => {
  expect(getScrollBarTop(100, 200, 50, 50)).toBe(25)
})

test('getScrollBarTop - bottom', () => {
  expect(getScrollBarTop(100, 200, 100, 50)).toBe(50)
})

test('getScrollBarTop - bottom with minimum scrollbar height', () => {
  expect(getScrollBarTop(100, 1000, 900, 20)).toBe(80)
})
