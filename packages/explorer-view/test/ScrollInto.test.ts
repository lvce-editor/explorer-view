import { test, expect } from '@jest/globals'
import { scrollInto } from '../src/parts/ScrollInto/ScrollInto.js'

test('when index is below minLineY', () => {
  const result = scrollInto(5, 10, 20)
  expect(result).toEqual({
    newMinLineY: 0,
    newMaxLineY: 10,
  })
})

test('when index is above maxLineY', () => {
  const result = scrollInto(25, 10, 20)
  expect(result).toEqual({
    newMinLineY: 20,
    newMaxLineY: 30,
  })
})

test('when index is within range', () => {
  const result = scrollInto(15, 10, 20)
  expect(result).toEqual({
    newMinLineY: 10,
    newMaxLineY: 20,
  })
})

test('when range is odd', () => {
  const result = scrollInto(5, 10, 21)
  expect(result).toEqual({
    newMinLineY: 0,
    newMaxLineY: 11,
  })
})
