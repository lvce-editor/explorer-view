import { expect, test } from '@jest/globals'
import { getScrollBarVirtualDom } from '../src/parts/GetScrollBarVirtualDom/GetScrollBarVirtualDom.ts'

test('getScrollBarVirtualDom - no scrollbar when height is 0', () => {
  const dom = getScrollBarVirtualDom(0, 0)
  expect(dom).toEqual([])
})

test('getScrollBarVirtualDom - renders scrollbar with height and position', () => {
  const dom = getScrollBarVirtualDom(100, 50)
  expect(dom).toEqual([
    {
      childCount: 1,
      className: 'ScrollBar ScrollBarSmall',
      type: 4,
    },
    {
      childCount: 0,
      className: 'ScrollBarThumb',
      height: '100px',
      translate: '0px 50px',
      type: 4,
    },
  ])
})
