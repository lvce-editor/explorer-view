import { expect, test } from '@jest/globals'
import { getFocusedIndexCancel } from '../src/parts/GetFocusedIndexCancel/GetFocusedIndexCancel.ts'

test('getFocusedIndexCancel - clamps index to last remaining item when edited placeholder was removed', () => {
  const items = [
    {
      depth: 0,
      name: 'file1.txt',
      selected: false,
      type: 2,
      uri: '/file1.txt',
    },
  ]

  const result = getFocusedIndexCancel(items, 1)

  expect(result).toBe(0)
})

test('getFocusedIndexCancel - returns original editing index when still in bounds', () => {
  const items = [
    {
      depth: 0,
      name: 'file1.txt',
      selected: false,
      type: 2,
      uri: '/file1.txt',
    },
    {
      depth: 0,
      name: 'file2.txt',
      selected: false,
      type: 2,
      uri: '/file2.txt',
    },
  ]

  const result = getFocusedIndexCancel(items, 1)

  expect(result).toBe(1)
})
