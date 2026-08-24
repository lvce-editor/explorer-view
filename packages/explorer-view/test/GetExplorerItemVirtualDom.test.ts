import { expect, test } from '@jest/globals'
import type { VisibleExplorerItem } from '../src/parts/VisibleExplorerItem/VisibleExplorerItem.ts'
import { getExplorerItemVirtualDom } from '../src/parts/GetExplorerItemVirtualDom/GetExplorerItemVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('basic item', () => {
  const item: VisibleExplorerItem = {
    ariaExpanded: undefined,
    chevron: 0,
    className: '',
    depth: 1,
    hasEditingError: false,
    icon: 'file',
    id: '1',
    indent: 34,
    index: 0,
    isCut: false,
    isEditing: false,
    isIgnored: false,
    name: 'test.txt',
    path: '/test.txt',
    posInSet: 1,
    selected: false,
    setSize: 2,
  }
  const dom = getExplorerItemVirtualDom(item)
  expect(dom).toHaveLength(5)
  expect(dom[0].type).toBe(4)
  expect(dom[0].role).toBe('treeitem')
  expect(dom[0].ariaLabel).toBe('test.txt')
  expect(dom[0].ariaSelected).toBeUndefined()
  expect(dom[0].paddingLeft).toBe(34)
  expect(dom[0].title).toBe('/test.txt')
})

test('item without an icon does not render a file icon placeholder', () => {
  const item: VisibleExplorerItem = {
    ariaExpanded: undefined,
    chevron: 0,
    className: '',
    depth: 1,
    hasEditingError: false,
    icon: '',
    id: '1',
    indent: 34,
    index: 0,
    isCut: false,
    isEditing: false,
    isIgnored: false,
    name: 'test.txt',
    path: '/test.txt',
    posInSet: 1,
    selected: false,
    setSize: 1,
  }

  const dom = getExplorerItemVirtualDom(item)

  expect(dom[0].childCount).toBe(2)
  expect(dom).toHaveLength(4)
  expect(dom[1]).toEqual({ childCount: 0, className: 'FileIconSlot', type: VirtualDomElements.Div })
  expect(dom.some((node) => node.className === 'FileIcon')).toBe(false)
})

test('selected item', () => {
  const item: VisibleExplorerItem = {
    ariaExpanded: undefined,
    chevron: 0,
    className: 'TreeItemActive',
    depth: 1,
    hasEditingError: false,
    icon: 'file',
    id: '1',
    indent: 0,
    index: 0,
    isCut: false,
    isEditing: false,
    isIgnored: false,
    name: 'test.txt',
    path: '/test.txt',
    posInSet: 1,
    selected: true,
    setSize: 2,
  }
  const dom = getExplorerItemVirtualDom(item)
  expect(dom[0].ariaSelected).toBe('true')
})

test('file uri item removes file scheme from title', () => {
  const item: VisibleExplorerItem = {
    ariaExpanded: undefined,
    chevron: 0,
    className: '',
    depth: 1,
    hasEditingError: false,
    icon: 'file',
    id: '1',
    indent: 0,
    index: 0,
    isCut: false,
    isEditing: false,
    isIgnored: false,
    name: 'test.txt',
    path: 'file:///test.txt',
    posInSet: 1,
    selected: false,
    setSize: 2,
  }
  const dom = getExplorerItemVirtualDom(item)
  expect(dom[0].title).toBe('/test.txt')
})

test('non-file uri item keeps scheme in title', () => {
  const item: VisibleExplorerItem = {
    ariaExpanded: undefined,
    chevron: 0,
    className: '',
    depth: 1,
    hasEditingError: false,
    icon: 'file',
    id: '1',
    indent: 0,
    index: 0,
    isCut: false,
    isEditing: false,
    isIgnored: false,
    name: 'test.txt',
    path: 'memfs:///test.txt',
    posInSet: 1,
    selected: false,
    setSize: 2,
  }
  const dom = getExplorerItemVirtualDom(item)
  expect(dom[0].title).toBe('memfs:///test.txt')
})

test('item with chevron', () => {
  const item: VisibleExplorerItem = {
    ariaExpanded: 'true',
    chevron: 1,
    className: '',
    depth: 1,
    hasEditingError: false,
    icon: 'folder',
    id: '1',
    indent: 0,
    index: 0,
    isCut: false,
    isEditing: false,
    isIgnored: false,
    name: 'test',
    path: '/test',
    posInSet: 1,
    selected: false,
    setSize: 2,
  }
  const dom = getExplorerItemVirtualDom(item)
  expect(dom).toHaveLength(6)
  expect(dom[0].type).toBe(4)
  expect(dom[0].role).toBe('treeitem')
  expect(dom[0].ariaLabel).toBe('test')
})

test('item in editing state', () => {
  const item: VisibleExplorerItem = {
    ariaExpanded: undefined,
    chevron: 0,
    className: '',
    depth: 1,
    hasEditingError: false,
    icon: 'file',
    id: '1',
    indent: 0,
    index: 0,
    isCut: false,
    isEditing: true,
    isIgnored: false,
    name: 'test.txt',
    path: '/test.txt',
    posInSet: 1,
    selected: false,
    setSize: 2,
  }
  const dom = getExplorerItemVirtualDom(item)
  expect(dom).toHaveLength(4)
  expect(dom[0].type).toBe(4)
  expect(dom[0].role).toBe('treeitem')
})

test('item with error', () => {
  const item: VisibleExplorerItem = {
    ariaExpanded: undefined,
    chevron: 0,
    className: '',
    depth: 1,
    hasEditingError: true,
    icon: 'file',
    id: '1',
    indent: 0,
    index: 0,
    isCut: false,
    isEditing: true,
    isIgnored: false,
    name: 'test.txt',
    path: '/test.txt',
    posInSet: 1,
    selected: false,
    setSize: 2,
  }
  const dom = getExplorerItemVirtualDom(item)
  expect(dom).toHaveLength(4)
  expect(dom[0].type).toBe(4)
  expect(dom[0].role).toBe('treeitem')
})
