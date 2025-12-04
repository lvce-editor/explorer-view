import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { renderItems } from '../src/parts/RenderItems/RenderItems.ts'

test('renderItems - basic', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    focused: true,
    items: [
      {
        depth: 0,
        name: 'test',
        path: '/test',
        selected: false,
        type: 1,
      },
    ],
    width: 500,
  }
  const result = renderItems(oldState, newState)
  expect(result[0]).toBe('Viewlet.setDom2')
  expect(result[1]).toBeDefined()
})

test('renderItems - narrow width', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    focused: true,
    items: [
      {
        depth: 0,
        name: 'test',
        path: '/test',
        selected: false,
        type: 1,
      },
    ],
    width: 400,
  }
  const result = renderItems(oldState, newState)
  expect(result[0]).toBe('Viewlet.setDom2')
  expect(result[1]).toBeDefined()
})
