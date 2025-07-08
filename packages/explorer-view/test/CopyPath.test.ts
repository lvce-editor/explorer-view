import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { copyPath } from '../src/parts/CopyPath/CopyPath.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

test.skip('copyPath - returns state unchanged', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      {
        name: 'test',
        type: 1,
        path: '/test/path',
        depth: 0,
        selected: false,
      },
    ],
  }

  const result = await copyPath(state)
  expect(result).toBe(state)
})

test.skip('copyPath - handles empty items array', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [],
  }

  const result = await copyPath(state)
  expect(result).toBe(state)
})

test.skip('copyPath - basic', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      {
        name: 'test',
        type: DirentType.File,
        path: '/test',
        depth: 0,
        selected: false,
      },
    ],
  }
  const result = await copyPath(state)
  expect(result).toBeDefined()
})
