import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { dropTargetFull } from '../DropTargetFull/DropTargetFull.ts'
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

const getClassName = (focused: boolean, focusedIndex: number, dropTarget: readonly number[]): string => {
  const extraClass1 = focused && focusedIndex === -1 ? ClassNames.FocusOutline : ClassNames.Empty
  const extraClass2 = dropTarget === dropTargetFull ? ClassNames.ExplorerDropTarget : ClassNames.Empty
  const className = MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.Explorer, extraClass1, extraClass2)
  return className
}

export const getExplorerVirtualDom = (
  visibleItems: readonly VisibleExplorerItem[],
  focusedIndex: number,
  root: string,
  isWide: boolean,
  focused: boolean,
  dropTargets: readonly number[],
): readonly VirtualDomNode[] => {
  if (!root) {
    return GetExplorerWelcomeVirtualDom.getExplorerWelcomeVirtualDom(isWide)
  }
  const dom: readonly VirtualDomNode[] = [
    {
      type: VirtualDomElements.Div,
      className: getClassName(focused, focusedIndex, dropTargets),
      tabIndex: 0,
      role: AriaRoles.Tree,
      ariaLabel: ExplorerStrings.filesExplorer(),
      childCount: visibleItems.length,
      ariaActiveDescendant: getActiveDescendant(focusedIndex),
      onBlur: DomEventListenerFunctions.HandleListBlur,
      onClick: DomEventListenerFunctions.HandleClick,
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      onDragLeave: DomEventListenerFunctions.HandleDragLeave,
      onDragOver: DomEventListenerFunctions.HandleDragOver,
      onDrop: DomEventListenerFunctions.HandleDrop,
      onFocus: DomEventListenerFunctions.HandleListFocus,
      onPointerDown: DomEventListenerFunctions.HandlePointerDown,
      onWheel: DomEventListenerFunctions.HandleWheel,
    },
    ...visibleItems.flatMap(GetExplorerItemVirtualDom.getExplorerItemVirtualDom),
  ]
  return dom
}
