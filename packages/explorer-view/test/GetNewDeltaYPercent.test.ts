import { expect, test } from '@jest/globals'
import { getNewDeltaYPercent } from '../src/parts/GetNewDeltaYPercent/GetNewDeltaYPercent.ts'

test('getNewDeltaYPercent - top', () => {
  expect(getNewDeltaYPercent(100, 20, 5)).toEqual({
    handleOffset: 5,
    percent: 0,
  })
})

test('getNewDeltaYPercent - middle', () => {
  expect(getNewDeltaYPercent(100, 20, 50)).toEqual({
    handleOffset: 10,
    percent: 0.5,
  })
})

test('getNewDeltaYPercent - bottom', () => {
  expect(getNewDeltaYPercent(100, 20, 95)).toEqual({
    handleOffset: 15,
    percent: 1,
  })
})
