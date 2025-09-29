import { test, expect } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { renderCss } from '../src/parts/RenderCss/RenderCss.ts'

test('renderCss - basic with empty visibleExplorerItems', () => {
  const oldState = createDefaultState()
  const newState: ExplorerState = {
    ...createDefaultState(),
    scrollBarHeight: 20,
    uid: 123,
    visibleExplorerItems: [],
  }
  const result = renderCss(oldState, newState)
  expect(result).toEqual([
    'Viewlet.setCss',
    123,
    `.Explorer {
  --ScrollBarThumbHeight: 20px;
}`,
  ])
})

test('renderCss - with single visibleExplorerItem', () => {
  const oldState = createDefaultState()
  const newState: ExplorerState = {
    ...createDefaultState(),
    scrollBarHeight: 15,
    uid: 456,
    visibleExplorerItems: [
      {
        isEditing: false,
        hasEditingError: false,
        icon: 'file',
        depth: 0,
        name: 'test.txt',
        path: '/test.txt',
        posInSet: 1,
        setSize: 1,
        indent: 10,
        chevron: 0,
        id: '1',
        className: 'file',
        ariaExpanded: undefined,
        selected: false,
        isCut: false,
        isIgnored: false,
        index: 0,
      },
    ],
  }
  const result = renderCss(oldState, newState)
  expect(result).toEqual([
    'Viewlet.setCss',
    456,
    `.Explorer {
  --ScrollBarThumbHeight: 15px;
}
.Indent-10 {
  padding-left: 10px;
}`,
  ])
})

test('renderCss - with multiple visibleExplorerItems with different indents', () => {
  const oldState = createDefaultState()
  const newState: ExplorerState = {
    ...createDefaultState(),
    scrollBarHeight: 25,
    uid: 789,
    visibleExplorerItems: [
      {
        isEditing: false,
        hasEditingError: false,
        icon: 'folder',
        depth: 0,
        name: 'folder1',
        path: '/folder1',
        posInSet: 1,
        setSize: 2,
        indent: 0,
        chevron: 1,
        id: '1',
        className: 'folder',
        ariaExpanded: 'true',
        selected: false,
        isCut: false,
        isIgnored: false,
        index: 0,
      },
      {
        isEditing: false,
        hasEditingError: false,
        icon: 'file',
        depth: 1,
        name: 'file1.txt',
        path: '/folder1/file1.txt',
        posInSet: 1,
        setSize: 1,
        indent: 20,
        chevron: 0,
        id: '2',
        className: 'file',
        ariaExpanded: undefined,
        selected: false,
        isCut: false,
        isIgnored: false,
        index: 1,
      },
      {
        isEditing: false,
        hasEditingError: false,
        icon: 'file',
        depth: 1,
        name: 'file2.txt',
        path: '/folder1/file2.txt',
        posInSet: 2,
        setSize: 1,
        indent: 20,
        chevron: 0,
        id: '3',
        className: 'file',
        ariaExpanded: undefined,
        selected: false,
        isCut: false,
        isIgnored: false,
        index: 2,
      },
    ],
  }
  const result = renderCss(oldState, newState)
  expect(result).toEqual([
    'Viewlet.setCss',
    789,
    `.Explorer {
  --ScrollBarThumbHeight: 25px;
}
.Indent-0 {
  padding-left: 0px;
}
.Indent-20 {
  padding-left: 20px;
}`,
  ])
})

test('renderCss - with duplicate indents should only generate unique indent classes', () => {
  const oldState = createDefaultState()
  const newState: ExplorerState = {
    ...createDefaultState(),
    scrollBarHeight: 30,
    uid: 999,
    visibleExplorerItems: [
      {
        isEditing: false,
        hasEditingError: false,
        icon: 'file',
        depth: 0,
        name: 'file1.txt',
        path: '/file1.txt',
        posInSet: 1,
        setSize: 3,
        indent: 10,
        chevron: 0,
        id: '1',
        className: 'file',
        ariaExpanded: undefined,
        selected: false,
        isCut: false,
        isIgnored: false,
        index: 0,
      },
      {
        isEditing: false,
        hasEditingError: false,
        icon: 'file',
        depth: 0,
        name: 'file2.txt',
        path: '/file2.txt',
        posInSet: 2,
        setSize: 3,
        indent: 10,
        chevron: 0,
        id: '2',
        className: 'file',
        ariaExpanded: undefined,
        selected: false,
        isCut: false,
        isIgnored: false,
        index: 1,
      },
      {
        isEditing: false,
        hasEditingError: false,
        icon: 'file',
        depth: 0,
        name: 'file3.txt',
        path: '/file3.txt',
        posInSet: 3,
        setSize: 3,
        indent: 20,
        chevron: 0,
        id: '3',
        className: 'file',
        ariaExpanded: undefined,
        selected: false,
        isCut: false,
        isIgnored: false,
        index: 2,
      },
    ],
  }
  const result = renderCss(oldState, newState)
  expect(result).toEqual([
    'Viewlet.setCss',
    999,
    `.Explorer {
  --ScrollBarThumbHeight: 30px;
}
.Indent-10 {
  padding-left: 10px;
}
.Indent-20 {
  padding-left: 20px;
}`,
  ])
})

test('renderCss - with zero scrollBarHeight', () => {
  const oldState = createDefaultState()
  const newState: ExplorerState = {
    ...createDefaultState(),
    scrollBarHeight: 0,
    uid: 111,
    visibleExplorerItems: [
      {
        isEditing: false,
        hasEditingError: false,
        icon: 'file',
        depth: 0,
        name: 'test.txt',
        path: '/test.txt',
        posInSet: 1,
        setSize: 1,
        indent: 5,
        chevron: 0,
        id: '1',
        className: 'file',
        ariaExpanded: undefined,
        selected: false,
        isCut: false,
        isIgnored: false,
        index: 0,
      },
    ],
  }
  const result = renderCss(oldState, newState)
  expect(result).toEqual([
    'Viewlet.setCss',
    111,
    `.Explorer {
  --ScrollBarThumbHeight: 0px;
}
.Indent-5 {
  padding-left: 5px;
}`,
  ])
})
