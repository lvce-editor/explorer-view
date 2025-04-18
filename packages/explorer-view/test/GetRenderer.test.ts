import { test, expect } from '@jest/globals'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import { getRenderer } from '../src/parts/GetRenderer/GetRenderer.ts'
import * as RenderFocus from '../src/parts/RenderFocus/RenderFocus.ts'
import * as RenderItems from '../src/parts/RenderItems/RenderItems.ts'

test('getRenderer - RenderItems', () => {
  const renderer = getRenderer(DiffType.RenderItems)
  expect(renderer).toBe(RenderItems.renderItems)
})

test('getRenderer - RenderFocus', () => {
  const renderer = getRenderer(DiffType.RenderFocus)
  expect(renderer).toBe(RenderFocus.renderFocus)
})

test('getRenderer - unknown renderer', () => {
  expect(() => getRenderer(999)).toThrow('unknown renderer')
})
