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
      type: 4,
      className: 'ScrollBar ScrollBarSmall',
      childCount: 1,
    },
    {
      type: 4,
      className: 'ScrollBarThumb',
      childCount: 0,
      height: '100px',
      translate: '0px 50px',
    },
  ])
})
