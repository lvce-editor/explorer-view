import { expect, test } from '@jest/globals'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getScrollBarVirtualDom } from '../src/parts/GetScrollBarVirtualDom/GetScrollBarVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getScrollBarVirtualDom - no scrollbar when height is 0', () => {
  const dom = getScrollBarVirtualDom(0)
  expect(dom).toEqual([])
})

test('getScrollBarVirtualDom - renders scrollbar', () => {
  const dom = getScrollBarVirtualDom(100)
  expect(dom).toEqual([
    {
      childCount: 1,
      className: 'ScrollBar ScrollBarSmall',
      onPointerDown: DomEventListenerFunctions.HandleScrollBarPointerDown,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'ScrollBarThumb',
      type: VirtualDomElements.Div,
    },
  ])
})
