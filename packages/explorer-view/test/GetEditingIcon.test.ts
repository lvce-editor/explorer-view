import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import * as GetEditingIcon from '../src/parts/GetEditingIcon/GetEditingIcon.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

test('getEditingIcon - CreateFile', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...params: any[]) => {
      if (method === 'IconTheme.getFileIcon') {
        return 'file-icon'
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.CreateFile, 'test.txt')
  expect(result).toBe('file-icon')
})

test('getEditingIcon - CreateFolder', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...params: any[]) => {
      if (method === 'IconTheme.getFolderIcon') {
        return 'folder-icon'
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.CreateFolder, 'test-folder')
  expect(result).toBe('folder-icon')
})

test('getEditingIcon - Rename File', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...params: any[]) => {
      if (method === 'IconTheme.getFileIcon') {
        return 'file-icon'
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test.txt', DirentType.File)
  expect(result).toBe('file-icon')
})

test('getEditingIcon - Rename EditingFile', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...params: any[]) => {
      if (method === 'IconTheme.getFileIcon') {
        return 'file-icon'
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test.txt', DirentType.EditingFile)
  expect(result).toBe('file-icon')
})

test('getEditingIcon - Rename Directory', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...params: any[]) => {
      if (method === 'IconTheme.getFolderIcon') {
        return 'folder-icon'
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test-folder', DirentType.Directory)
  expect(result).toBe('folder-icon')
})

test('getEditingIcon - Rename EditingFolder', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...params: any[]) => {
      if (method === 'IconTheme.getFolderIcon') {
        return 'folder-icon'
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test-folder', DirentType.EditingFolder)
  expect(result).toBe('folder-icon')
})

test('getEditingIcon - Rename EditingDirectoryExpanded', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...params: any[]) => {
      if (method === 'IconTheme.getFolderIcon') {
        return 'folder-icon'
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test-folder', DirentType.EditingDirectoryExpanded)
  expect(result).toBe('folder-icon')
})

test('getEditingIcon - Rename with unsupported dirent type', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...params: any[]) => {
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test', DirentType.Symlink)
  expect(result).toBe('')
})

test('getEditingIcon - Rename without dirent type', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...params: any[]) => {
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test')
  expect(result).toBe('')
})

test('getEditingIcon - None editing type', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...params: any[]) => {
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.None, 'test')
  expect(result).toBe('')
})

test('getEditingIcon - unknown editing type', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...params: any[]) => {
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const result = await GetEditingIcon.getEditingIcon(999, 'test')
  expect(result).toBe('')
})
