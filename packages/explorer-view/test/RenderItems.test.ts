import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { renderItems } from '../src/parts/RenderItems/RenderItems.ts'

test('renderItems - basic', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    width: 500,
    focused: true,
    items: [
      {
        name: 'test',
        type: 1,
        path: '/test',
        depth: 0,
        selected: false,
      },
    ],
  }
  const result = renderItems(oldState, newState)
  expect(result[0]).toBe('Viewlet.setDom2')
  expect(result[1]).toBeDefined()
})

test('renderItems - narrow width', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    width: 400,
    focused: true,
    items: [
      {
        name: 'test',
        type: 1,
        path: '/test',
        depth: 0,
        selected: false,
      },
    ],
  }
  const result = renderItems(oldState, newState)
  expect(result[0]).toBe('Viewlet.setDom2')
  expect(result[1]).toBeDefined()
})
