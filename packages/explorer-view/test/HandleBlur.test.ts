import { expect, test } from '@jest/globals'
import { RendererWorker, IconThemeWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import { handleBlur } from '../src/parts/HandleBlur/HandleBlur.ts'

test('handleBlur - when not editing, sets focused to false', async () => {
  const state: ExplorerState = createDefaultState()
  const newState = await handleBlur(state)
  expect(newState.focused).toBe(false)
})

test.skip('handleBlur - when editing, keeps state unchanged', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.writeFile'() {
      return
    },
  })
  
  IconThemeWorker.registerMockRpc({
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getIcons'() {
      return Array(1).fill('')
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    editingType: ExplorerEditingType.CreateFile,
    editingIndex: 0,
    items: [
      {
        type: DirentType.File,
        depth: 0,
        name: '1',
        path: '1',
        selected: false,
      },
    ],
    editingValue: 'created.txt',
  }
  const newState = await handleBlur(state)
  expect(newState).toEqual({
    ...state,
    editingIndex: -1,
    editingType: 0,
    fileIconCache: {
      '1': '',
      '1/created.txt': '',
    },
    focus: 1,
    focusedIndex: 1,
    icons: ['', ''],
    maxLineY: 2,
  })
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.getPathSeparator'],
    ['FileSystem.writeFile', '1/created.txt', ''],
    ['IconTheme.getFileIcon', { name: '1', type: DirentType.File, path: '1', depth: 0, selected: false }],
    [
      'IconTheme.getIcons',
      [
        { name: '1', type: DirentType.File, path: '1', depth: 0, selected: false },
        { name: 'created.txt', type: DirentType.File, path: '1/created.txt', depth: 0, selected: false },
      ],
    ],
  ])
})
