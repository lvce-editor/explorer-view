import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import { newFile } from '../src/parts/NewFile/NewFile.ts'

test('newFile', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Workspace.getPath'() {
      return '/new/path'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'Preferences.get'() {
      return false
    },
    'Focus.setFocus'() {
      return undefined
    },
    'IconTheme.getIcons'(requests: readonly any[]) {
      return requests.map((param) => {
        if (param.type === 2) {
          return `folder-icon`
        }
        return `file-icon`
      })
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'testfolder', type: DirentType.Directory, path: '/testfolder', depth: 0, selected: false }],
    maxLineY: 1,
  }

  const result = await newFile(state)
  expect(result).toEqual({
    ...state,
    editingIndex: 1,
    focusedIndex: 1,
    editingType: ExplorerEditingType.CreateFile,
    visibleExplorerItems: expect.anything(),
    items: [
      {
        depth: 0,
        name: 'testfolder',
        path: '/testfolder',
        selected: false,
        type: 3,
        setSize: 1,
      },
      {
        depth: 1,
        icon: '',
        name: '',
        type: DirentType.EditingFile,
        path: '/testfolder',
        selected: false,
        posInSet: 1,
        setSize: 2,
      },
    ],
    editingValue: '',
    focus: 2,
  })
  expect(mockRpc.invocations).toEqual([['FileSystem.readDirWithFileTypes', '/testfolder']])
})
