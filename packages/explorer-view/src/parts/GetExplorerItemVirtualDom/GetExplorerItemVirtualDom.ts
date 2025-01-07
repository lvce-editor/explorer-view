import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as GetVirtualDomFile from '../GetVirtualDomFile/GetVirtualDomFile.ts'
import * as GetVirtualDomFolder from '../GetVirtualDomFolder/GetVirtualDomFolder.ts'
import { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'

export const getExplorerItemVirtualDom = (item: VisibleExplorerItem): readonly VirtualDomNode[] => {
  const { type } = item
  switch (type) {
    case DirentType.Directory:
    case DirentType.DirectoryExpanding:
    case DirentType.DirectoryExpanded:
      return GetVirtualDomFolder.getItemVirtualDomFolder(item)
    default:
      return GetVirtualDomFile.getItemVirtualDomFile(item)
  }
}
