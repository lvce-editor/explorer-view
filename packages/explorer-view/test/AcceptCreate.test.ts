import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { acceptCreate } from '../src/parts/AcceptCreate/AcceptCreate.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import * as ExplorerStrings from '../src/parts/ExplorerStrings/ExplorerStrings.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'

test('acceptCreate - empty file name', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    editingValue: '',
  }

  const result = await acceptCreate(state, DirentType.File)
  expect(result).toEqual({
    ...state,
    editingErrorMessage: ExplorerStrings.fileOrFolderNameMustBeProvided(),
  })
})

test('acceptCreate - successful file creation', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getIcons'() {
      return Array(2).fill('')
    },
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === 'memfs:///workspace') {
        return [{ name: 'test', type: DirentType.Directory }]
      }
      if (path === 'memfs:///workspace/test') {
        return [{ name: 'test.txt', type: DirentType.File }]
      }
      throw new Error(`unexpected file read ${path}`)
    },
    'FileSystem.mkdir'() {
      return
    },
    'FileSystem.writeFile'() {
      return
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    root: 'memfs:///workspace',
    editingValue: 'test.txt',
    focusedIndex: 0,
    editingIndex: 1,
    items: [
      {
        name: 'test',
        type: DirentType.Directory,
        path: 'memfs:///workspace/test',
        depth: 0,
        selected: false,
      },
      {
        name: 'test.txt',
        type: DirentType.EditingFile,
        path: 'memfs:///workspace/test/test.txt',
        depth: 1,
        posInSet: 1,
        setSize: 1,
        icon: '',
        selected: false,
      },
    ],
    minLineY: 0,
    height: 100,
    itemHeight: 20,
    fileIconCache: {},
  }

  const result = await acceptCreate(state, DirentType.File)
  expect(result).toEqual({
    ...state,
    items: [
      {
        name: 'test',
        type: DirentType.DirectoryExpanded,
        depth: 1,
        selected: false,
        icon: '',
        path: 'memfs:///workspace/test',
        posInSet: 1,
        setSize: 1,
      },
      {
        name: 'test.txt',
        type: DirentType.File,
        path: 'memfs:///workspace/test/test.txt',
        depth: 2,
        posInSet: 1,
        setSize: 1,
        icon: '',
        selected: false,
      },
    ],
    editingIndex: -1,
    focusedIndex: 1,
    editingType: ExplorerEditingType.None,
    focus: FocusId.List,
  })
})
