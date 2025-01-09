import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'

export const getItemVirtualDomFile = (item: VisibleExplorerItem): readonly VirtualDomNode[] => {
  throw new Error('deprecated')
}
