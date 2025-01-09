import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'
import * as GetVirtualDomFolder from '../GetVirtualDomFolder/GetVirtualDomFolder.ts'

export const getExplorerItemVirtualDom = (item: VisibleExplorerItem): readonly VirtualDomNode[] => {
  return GetVirtualDomFolder.getItemVirtualDomFolder(item)
}
