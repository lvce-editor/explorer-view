import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as ExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import * as GetExplorerItemVirtualDom from '../GetExplorerItemVirtualDom/GetExplorerItemVirtualDom.ts'
import * as GetExplorerWelcomeVirtualDom from '../GetExplorerWelcomeVirtualDom/GetExplorerWelcomeVirtualDom.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getExplorerVirtualDom = (visibleItems, focusedIndex, root, isWide) => {
  if (!root) {
    return GetExplorerWelcomeVirtualDom.getExplorerWelcomeVirtualDom(isWide)
  }
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.Explorer),
    tabIndex: 0,
    role: AriaRoles.Tree,
    ariaLabel: ExplorerStrings.filesExplorer(),
    childCount: visibleItems.length,
    ariaActiveDescendant: focusedIndex >= 0 ? 'TreeItemActive' : undefined,
    onFocus: DomEventListenerFunctions.HandleFocus,
    onBlur: DomEventListenerFunctions.HandleBlur,
    onContextMenu: DomEventListenerFunctions.HandleContextMenu,
    onPointerDown: DomEventListenerFunctions.HandlePointerDown,
    onWheel: DomEventListenerFunctions.HandleWheel,
    onClick: DomEventListenerFunctions.HandleClick,
  })
  dom.push(...visibleItems.flatMap(GetExplorerItemVirtualDom.getExplorerItemVirtualDom))
  return dom
}
