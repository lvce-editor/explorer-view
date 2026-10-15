import { expect, test } from '@jest/globals'
import type { VirtualDomNode } from '../src/parts/VirtualDomNode/VirtualDomNode.ts'
import type { VisibleExplorerItem } from '../src/parts/VisibleExplorerItem/VisibleExplorerItem.ts'
import { getListItemsVirtualDom } from '../src/parts/GetListItemsVirtualDom/GetListItemsVirtualDom.ts'

test('registers pointer and native paste handlers on the explorer tree', () => {
  const [tree] = getListItemsVirtualDom([], -1, false, [])

  expect(tree).toMatchObject({
    onPaste: 26,
    onPointerDown: 14,
    onPointerUp: 25,
  })
})

test('marks only the first visible row after scrolling without changing item state', () => {
  const item: VisibleExplorerItem = {
    ariaExpanded: undefined,
    chevron: 0,
    className: 'TreeItem Indent-34 TreeItemActive',
    depth: 1,
    hasEditingError: false,
    icon: '',
    id: undefined,
    index: 50,
    isCut: false,
    isEditing: false,
    isIgnored: false,
    name: 'file.txt',
    posInSet: 51,
    selected: true,
    setSize: 100,
    uri: '/file.txt',
  }
  const nextItem = { ...item, index: 51 }
  const getRows = (items: readonly VisibleExplorerItem[]): readonly VirtualDomNode[] =>
    getListItemsVirtualDom(items, -1, false, []).filter((node) => node.role === 'treeitem')

  const rows = getRows([item, nextItem])
  expect(rows.map((row) => row.className)).toEqual(['TreeItem Indent-34 TreeItemActive ExplorerFirstTreeItem', 'TreeItem Indent-34 TreeItemActive'])
  expect(getRows([nextItem])[0].className).toBe('TreeItem Indent-34 TreeItemActive ExplorerFirstTreeItem')
  expect(item.className).toBe('TreeItem Indent-34 TreeItemActive')
  expect(nextItem.className).toBe('TreeItem Indent-34 TreeItemActive')
})
