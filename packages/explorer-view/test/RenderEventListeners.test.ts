import { expect, test } from '@jest/globals'
import * as RenderEventListeners from '../src/parts/RenderEventListeners/RenderEventListeners.ts'

test('renderEventListeners', () => {
  const eventListeners = RenderEventListeners.renderEventListeners()
  expect(eventListeners).toBeDefined()
  expect(eventListeners).toContainEqual({
    name: 21,
    params: ['handleKeyDown', 'event.defaultPrevented', 'event.key'],
  })
  expect(eventListeners).toContainEqual({
    name: 8,
    params: ['handleInputBlur', 'event.target.dataset.editingSessionId'],
  })
  expect(eventListeners).toContainEqual({
    name: 24,
    params: ['handleScrollBarClick', 'event.clientY'],
    preventDefault: true,
    trackPointerEvents: [22, 23],
  })
  expect(eventListeners).toContainEqual({
    name: 22,
    params: ['handleScrollBarMove', 'event.clientY'],
  })
  expect(eventListeners).toContainEqual({
    name: 23,
    params: ['handleScrollBarCaptureLost'],
  })
})
