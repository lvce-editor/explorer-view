import { expect, test } from '@jest/globals'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

test('stores an immediate post-render focus request by default', () => {
  RendererProcess.requestPostRenderFocus(1)

  expect(RendererProcess.takePostRenderFocus(1)).toBe(0)
  expect(RendererProcess.takePostRenderFocus(1)).toBeUndefined()
})

test('stores a delayed post-render focus request', () => {
  RendererProcess.requestPostRenderFocus(2, 100)

  expect(RendererProcess.takePostRenderFocus(2)).toBe(100)
})
