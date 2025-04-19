import { expect, test } from '@jest/globals'
import type { VisibleExplorerItem } from '../src/parts/VisibleExplorerItem/VisibleExplorerItem.ts'
import { getExplorerItemVirtualDom } from '../src/parts/GetExplorerItemVirtualDom/GetExplorerItemVirtualDom.ts'

test('basic item', () => {
  const item: VisibleExplorerItem = {
    posInSet: 1,
    setSize: 2,
    icon: 'file',
    name: 'test.txt',
    path: '/test.txt',
    depth: 1,
    indent: '0',
    chevron: 0,
    id: '1',
    className: '',
    isEditing: false,
    ariaExpanded: undefined,
    hasEditingError: false,
  }
  const dom = getExplorerItemVirtualDom(item)
  expect(dom).toHaveLength(4)
  expect(dom[0].type).toBe(4)
  expect(dom[0].role).toBe('treeitem')
  expect(dom[0].ariaLabel).toBe('test.txt')
})

test('item with chevron', () => {
  const item: VisibleExplorerItem = {
    posInSet: 1,
    setSize: 2,
    icon: 'folder',
    name: 'test',
    path: '/test',
    depth: 1,
    indent: '0',
    chevron: 1,
    id: '1',
    className: '',
    isEditing: false,
    ariaExpanded: 'true',
    hasEditingError: false,
  }
  const dom = getExplorerItemVirtualDom(item)
  expect(dom).toHaveLength(5)
  expect(dom[0].type).toBe(4)
  expect(dom[0].role).toBe('treeitem')
  expect(dom[0].ariaLabel).toBe('test')
})

test('item in editing state', () => {
  const item: VisibleExplorerItem = {
    posInSet: 1,
    setSize: 2,
    icon: 'file',
    name: 'test.txt',
    path: '/test.txt',
    depth: 1,
    indent: '0',
    chevron: 0,
    id: '1',
    className: '',
    isEditing: true,
    ariaExpanded: undefined,
    hasEditingError: false,
  }
  const dom = getExplorerItemVirtualDom(item)
  expect(dom).toHaveLength(3)
  expect(dom[0].type).toBe(4)
  expect(dom[0].role).toBe('treeitem')
})

test('item with error', () => {
  const item: VisibleExplorerItem = {
    posInSet: 1,
    setSize: 2,
    icon: 'file',
    name: 'test.txt',
    path: '/test.txt',
    depth: 1,
    indent: '0',
    chevron: 0,
    id: '1',
    className: '',
    isEditing: true,
    ariaExpanded: undefined,
    hasEditingError: true,
  }
  const dom = getExplorerItemVirtualDom(item)
  expect(dom).toHaveLength(3)
  expect(dom[0].type).toBe(4)
  expect(dom[0].role).toBe('treeitem')
})
