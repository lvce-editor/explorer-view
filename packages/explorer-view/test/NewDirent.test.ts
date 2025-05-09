import { expect, jest, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { newDirent } from '../src/parts/NewDirent/NewDirent.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

const handleFileIcons = (requests: readonly any[]) => {
  return requests.map((param) => {
    if (param.type === 2) {
      return `folder-icon`
    }
    return `file-icon`
  })
}

test('newDirent sets focus and updates state when no item is focused', async () => {
  const invoke = jest.fn((method: string, ...params: readonly any[]): any => {
    if (method === 'Workspace.getPath') {
      return '/new/path'
    }
    if (method === 'FileSystem.readDirWithFileTypes') {
      return []
    }
    if (method === 'FileSystem.getPathSeparator') {
      return '/'
    }
    if (method === 'Preferences.get') {
      return false
    }
    if (method === 'IconTheme.getFolderIcon') {
      return ''
    }
    if (method === 'Focus.setFocus') {
      return undefined
    }
    if (method === 'IconTheme.getIcons') {
      return handleFileIcons(params[0])
    }
    throw new Error(`unexpected method ${method}`)
  })

  const mockRpc = MockRpc.create({
    invoke,
    commandMap: {},
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    items: [],
  }
  const mockEditingType = 1

  const result = await newDirent(mockState, mockEditingType)
  expect(mockRpc.invoke).toHaveBeenCalledWith('Focus.setFocus', 14)
  expect(result).toEqual({
    ...mockState,
    editingIndex: 0,
    focusedIndex: 0,
    icons: ['file-icon'],
    editingType: mockEditingType,
    editingValue: '',
    focus: 2,
    maxLineY: 1,
    fileIconCache: { '/': 'file-icon' },
    items: [
      {
        depth: 0,
        icon: '',
        name: '',
        path: '/',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: 107,
      },
    ],
  })
})

test('newDirent handles directory click when focused item is a directory', async () => {
  const invoke = jest.fn((method: string, ...params: readonly any[]): any => {
    if (method === 'Workspace.getPath') {
      return '/new/path'
    }
    if (method === 'FileSystem.readDirWithFileTypes') {
      return []
    }
    if (method === 'FileSystem.getPathSeparator') {
      return '/'
    }
    if (method === 'Preferences.get') {
      return false
    }
    if (method === 'Focus.setFocus') {
      return undefined
    }
    if (method === 'IconTheme.getFolderIcon') {
      return ''
    }
    if (method === 'IconTheme.getIcons') {
      return handleFileIcons(params[0])
    }
    throw new Error(`unexpected method ${method}`)
  })

  const mockRpc = MockRpc.create({
    invoke,
    commandMap: {},
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test', type: DirentType.Directory, path: '/test', depth: 0, selected: false }],
  }
  const mockEditingType = 1

  const result = await newDirent(mockState, mockEditingType)
  expect(mockRpc.invoke).toHaveBeenCalledWith('Focus.setFocus', 14)
  expect(result).toEqual({
    ...mockState,
    editingIndex: 1,
    focusedIndex: 1,
    editingType: mockEditingType,
    items: [
      { name: 'test', type: DirentType.Directory, path: '/test', depth: 0, selected: false, setSize: 1 },
      {
        depth: 1,
        icon: '',
        name: '',
        path: '/test',
        posInSet: 1,
        selected: false,
        setSize: 2,
        type: DirentType.EditingFile,
      },
    ],
    icons: ['file-icon', 'file-icon'],
    fileIconCache: {
      '/test': 'file-icon',
    },
    editingValue: '',
    focus: 2,
    maxLineY: 2,
  })
})

test('newDirent updates state when focused item is not a directory', async () => {
  const invoke = jest.fn((method: string, ...params: readonly any[]): any => {
    if (method === 'Workspace.getPath') {
      return '/new/path'
    }
    if (method === 'FileSystem.readDirWithFileTypes') {
      return []
    }
    if (method === 'FileSystem.getPathSeparator') {
      return '/'
    }
    if (method === 'IconTheme.getFileIcon') {
      return ''
    }
    if (method === 'IconTheme.getFolderIcon') {
      return ''
    }
    if (method === 'Preferences.get') {
      return false
    }
    if (method === 'Focus.setFocus') {
      return undefined
    }
    if (method === 'IconTheme.getIcons') {
      return handleFileIcons(params[0])
    }
    throw new Error(`unexpected method ${method}`)
  })

  const mockRpc = MockRpc.create({
    invoke,
    commandMap: {},
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0, selected: false }],
  }
  const mockEditingType = 1

  const result = await newDirent(mockState, mockEditingType)
  expect(invoke).toHaveBeenCalledWith('Focus.setFocus', 14)
  expect(result).toEqual({
    ...mockState,
    editingIndex: 1,
    focusedIndex: 1,
    editingType: mockEditingType,
    editingValue: '',
    focus: 2,
    items: [
      {
        setSize: 1,
        name: 'test.txt',
        type: DirentType.File,
        path: '/test.txt',
        depth: 0,
        selected: false,
      },
      {
        depth: 1,
        icon: '',
        name: '',
        path: '/test.txt',
        posInSet: 1,
        selected: false,
        setSize: 2,
        type: DirentType.EditingFile,
      },
    ],
    maxLineY: 2,
    fileIconCache: {
      '/test.txt': 'file-icon',
    },
    icons: ['file-icon', 'file-icon'],
  })
})
