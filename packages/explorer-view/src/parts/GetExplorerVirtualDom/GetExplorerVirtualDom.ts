import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as ExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import * as GetExplorerItemVirtualDom from '../GetExplorerItemVirtualDom/GetExplorerItemVirtualDom.ts'
import * as GetExplorerWelcomeVirtualDom from '../GetExplorerWelcomeVirtualDom/GetExplorerWelcomeVirtualDom.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

const getActiveDescendant = (focusedIndex: number): string | undefined => {
  if (focusedIndex >= 0) {
    return 'TreeItemActive'
  }
  return undefined
}

export const getExplorerVirtualDom = (
  visibleItems: readonly VisibleExplorerItem[],
  focusedIndex: number,
  root: string,
  isWide: boolean,
  focused: boolean,
): readonly VirtualDomNode[] => {
  if (!root) {
    return GetExplorerWelcomeVirtualDom.getExplorerWelcomeVirtualDom(isWide)
  }
  const extraClass = focused && focusedIndex === -1 ? ClassNames.FocusOutline : ''
  const dom: readonly VirtualDomNode[] = [
    {
      type: VirtualDomElements.Div,
      className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.Explorer, extraClass),
      tabIndex: 0,
      role: AriaRoles.Tree,
      ariaLabel: ExplorerStrings.filesExplorer(),
      childCount: visibleItems.length,
      ariaActiveDescendant: getActiveDescendant(focusedIndex),
      onFocus: DomEventListenerFunctions.HandleListFocus,
      onBlur: DomEventListenerFunctions.HandleListBlur,
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      onPointerDown: DomEventListenerFunctions.HandlePointerDown,
      onWheel: DomEventListenerFunctions.HandleWheel,
      onClick: DomEventListenerFunctions.HandleClick,
      onDragOver: DomEventListenerFunctions.HandleDragOver,
      onDrop: DomEventListenerFunctions.HandleDrop,
    },
    ...visibleItems.flatMap(GetExplorerItemVirtualDom.getExplorerItemVirtualDom),
  ]
  return dom
}
