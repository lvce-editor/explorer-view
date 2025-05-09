import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetExplorerWelcomeVirtualDom from '../GetExplorerWelcomeVirtualDom/GetExplorerWelcomeVirtualDom.ts'
import * as GetListItemsVirtualDom from '../GetListItemsVirtualDom/GetListItemsVirtualDom.ts'
import * as GetScrollBarSize from '../GetScrollBarSize/GetScrollBarSize.ts'
import * as GetScrollBarVirtualDom from '../GetScrollBarVirtualDom/GetScrollBarVirtualDom.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

const parentNode: VirtualDomNode = {
  type: VirtualDomElements.Div,
  childCount: 2,
  className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.Explorer),
  role: 'none',
}

export const getExplorerVirtualDom = (
  visibleItems: readonly VisibleExplorerItem[],
  focusedIndex: number,
  root: string,
  isWide: boolean,
  focused: boolean,
  dropTargets: readonly number[],
  height: number,
  contentHeight: number,
  scrollTop: number,
): readonly VirtualDomNode[] => {
  if (!root) {
    return GetExplorerWelcomeVirtualDom.getExplorerWelcomeVirtualDom(isWide)
  }
  const scrollBarHeight = GetScrollBarSize.getScrollBarSize(height, contentHeight, 20)
  const scrollBarTop = Math.round((scrollTop / contentHeight) * height)
  const scrollBarDom = GetScrollBarVirtualDom.getScrollBarVirtualDom(scrollBarHeight, scrollBarTop)
  const dom: readonly VirtualDomNode[] = [
    parentNode,
    ...GetListItemsVirtualDom.getListItemsVirtualDom(visibleItems, focusedIndex, focused, dropTargets),
    ...scrollBarDom,
  ]
  return dom
}
