import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getContextMenuData } from '../src/parts/GetContextMenuData/GetContextMenuData.ts'

test('captures the resource and owner that opened the Explorer menu', () => {
  const state = {
    ...createDefaultState(),
    applicationId: 'preview',
    focusedIndex: 1,
    items: [
      { depth: 0, name: 'first.js', selected: true, type: DirentType.File, uri: 'file:///first.js' },
      { depth: 0, name: 'clicked.js', selected: false, type: DirentType.File, uri: 'file:///clicked.js' },
    ],
  }
  const data = getContextMenuData(state)
  state.focusedIndex = 0
  expect(data.applicationId).toBe('preview')
  expect(data.context).toEqual({ isDirectory: false, uri: 'file:///clicked.js' })
  expect(data.entries.some((entry) => entry.id === 'openInIntegratedTerminal')).toBe(true)
})

test('root menus identify the root as a directory', () => {
  expect(getContextMenuData({ ...createDefaultState(), root: 'file:///workspace' }).context).toEqual({ isDirectory: true, uri: 'file:///workspace' })
})
