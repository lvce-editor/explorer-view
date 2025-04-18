import { expect, test } from '@jest/globals'
import { copyPath } from '../src/parts/CopyPath/CopyPath.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('copyPath - returns state unchanged', async () => {
  const state = {
    ...createDefaultState(),
    items: [
      {
        name: 'test',
        type: 1,
        path: '/test/path',
        depth: 0,
      },
    ],
  }

  const result = await copyPath(state)
  expect(result).toBe(state)
})

test('copyPath - handles empty items array', async () => {
  const state = {
    ...createDefaultState(),
    items: [],
  }

  const result = await copyPath(state)
  expect(result).toBe(state)
})
