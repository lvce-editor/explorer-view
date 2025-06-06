import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as RpcRegistry from '@lvce-editor/rpc-registry'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getNewChildDirentsForNewDirent } from '../src/parts/GetNewChildDirentsForNewDirent/GetNewChildDirentsForNewDirent.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'

test.skip('getNewChildDirentsForNewDirent - empty directory', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const items = [
    {
      path: '/root/folder',
      posInSet: 1,
      setSize: 1,
      depth: 1,
      name: 'folder',
      type: DirentType.DirectoryExpanded,
      icon: '',
      selected: false,
    },
  ]

  const result = await getNewChildDirentsForNewDirent(items, 2, '/root/folder', DirentType.File)

  expect(result).toEqual([
    {
      name: '',
      type: DirentType.File,
      path: '',
      depth: 2,
      selected: false,
      posInSet: 1,
      setSize: 1,
      icon: '',
    },
  ])
})

test.skip('getNewChildDirentsForNewDirent - directory with existing children', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const items = [
    {
      path: '/root/folder',
      posInSet: 1,
      setSize: 1,
      depth: 1,
      name: 'folder',
      type: DirentType.DirectoryExpanded,
      icon: '',
      selected: false,
    },
    {
      path: '/root/folder/file1.txt',
      posInSet: 1,
      setSize: 2,
      depth: 2,
      name: 'file1.txt',
      type: DirentType.File,
      icon: '',
      selected: false,
    },
    {
      path: '/root/folder/file2.txt',
      posInSet: 2,
      setSize: 2,
      depth: 2,
      name: 'file2.txt',
      type: DirentType.File,
      icon: '',
      selected: false,
    },
  ]

  const result = await getNewChildDirentsForNewDirent(items, 2, '/root/folder', DirentType.File)

  expect(result).toEqual([
    {
      path: '/root/folder/file1.txt',
      posInSet: 1,
      setSize: 3,
      depth: 2,
      name: 'file1.txt',
      type: DirentType.File,
      icon: '',
      selected: false,
    },
    {
      path: '/root/folder/file2.txt',
      posInSet: 2,
      setSize: 3,
      depth: 2,
      name: 'file2.txt',
      type: DirentType.File,
      icon: '',
      selected: false,
    },
    {
      name: '',
      type: DirentType.File,
      path: '',
      depth: 2,
      selected: false,
      posInSet: 3,
      setSize: 3,
      icon: '',
    },
  ])
})

test.skip('getNewChildDirentsForNewDirent - directory with no children', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const items = [
    {
      path: '/root/folder',
      posInSet: 1,
      setSize: 1,
      depth: 1,
      name: 'folder',
      type: DirentType.DirectoryExpanded,
      icon: '',
      selected: false,
    },
  ]

  const result = await getNewChildDirentsForNewDirent(items, 2, '/root/folder', DirentType.DirectoryExpanded)

  expect(result).toEqual([
    {
      name: '',
      type: DirentType.DirectoryExpanded,
      path: '',
      depth: 2,
      selected: false,
      posInSet: 1,
      setSize: 1,
      icon: '',
    },
  ])
})

test.skip('getNewChildDirentsForNewDirent - different dirent types', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const items = [
    {
      path: '/root/folder',
      posInSet: 1,
      setSize: 1,
      depth: 1,
      name: 'folder',
      type: DirentType.DirectoryExpanded,
      icon: '',
      selected: false,
    },
    {
      path: '/root/folder/file1.txt',
      posInSet: 1,
      setSize: 2,
      depth: 2,
      name: 'file1.txt',
      type: DirentType.File,
      icon: '',
      selected: false,
    },
    {
      path: '/root/folder/folder1',
      posInSet: 2,
      setSize: 2,
      depth: 2,
      name: 'folder1',
      type: DirentType.DirectoryExpanded,
      icon: '',
      selected: false,
    },
  ]

  const result = await getNewChildDirentsForNewDirent(items, 2, '/root/folder', DirentType.SymLinkFolder)

  expect(result).toEqual([
    {
      path: '/root/folder/file1.txt',
      posInSet: 1,
      setSize: 4,
      depth: 2,
      name: 'file1.txt',
      type: DirentType.File,
      icon: '',
      selected: false,
    },
    {
      path: '/root/folder/folder1',
      posInSet: 2,
      setSize: 4,
      depth: 2,
      name: 'folder1',
      type: DirentType.DirectoryExpanded,
      icon: '',
      selected: false,
    },
    {
      name: '',
      type: DirentType.SymLinkFolder,
      path: '',
      depth: 2,
      selected: false,
      posInSet: 3,
      setSize: 4,
      icon: '',
    },
  ])
})

test.skip('getNewChildDirentsForNewDirent - error case', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        throw new Error('Failed to read directory')
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const items = [
    {
      path: '/root/folder',
      posInSet: 1,
      setSize: 1,
      depth: 1,
      name: 'folder',
      type: DirentType.DirectoryExpanded,
      icon: '',
      selected: false,
    },
  ]

  await expect(getNewChildDirentsForNewDirent(items, 2, '/root/folder', DirentType.File)).rejects.toThrow('Failed to read directory')
})
