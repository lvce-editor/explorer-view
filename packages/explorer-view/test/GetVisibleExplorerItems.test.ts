import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import { None, CreateFile } from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import { getVisibleExplorerItems } from '../src/parts/GetVisibleExplorerItems/GetVisibleExplorerItems.ts'

test('getVisibleExplorerItems - basic', () => {
  const items: ExplorerItem[] = [
    {
      depth: 0,
      name: 'test',
      path: '/test',
      type: 0,
      selected: false,
    },
  ]
  const editingIcon = ''
  const result = getVisibleExplorerItems(items, 0, 1, 0, -1, None, '', '', ['icon'], true, [], editingIcon)
  expect(result).toHaveLength(1)
  expect(result[0]).toMatchObject({
    depth: 0,
    name: 'test',
    path: '/test',
    icon: 'icon',
    isEditing: false,
    hasEditingError: false,
    indent: '26px',
    ariaExpanded: undefined,
    chevron: 0,
    id: 'TreeItemActive',
  })
})

test('getVisibleExplorerItems - editing', () => {
  const items: ExplorerItem[] = [
    {
      depth: 0,
      name: 'test',
      path: '/test',
      type: 0,
      selected: true,
    },
  ]
  const editingIcon = ''
  const result = getVisibleExplorerItems(items, 0, 1, 0, 0, None, 'new name', 'error', ['icon'], true, [], editingIcon)
  expect(result).toHaveLength(1)
  expect(result[0]).toMatchObject({
    isEditing: true,
    hasEditingError: true,
  })
})

test('getVisibleExplorerItems - new item', () => {
  const items: readonly ExplorerItem[] = []
  const editingIcon = ''
  const result = getVisibleExplorerItems(items, 0, 1, -1, -1, CreateFile, '', 'error', [], true, [], editingIcon)
  expect(result).toHaveLength(0)
  // expect(result[0]).toMatchObject({
  //   depth: 3,
  //   name: 'new',
  //   path: '/test/new',
  //   isEditing: true,
  //   hasEditingError: true,
  // })
})
