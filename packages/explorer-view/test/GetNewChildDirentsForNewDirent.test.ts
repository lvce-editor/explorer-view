import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getNewChildDirentsForNewDirent } from '../src/parts/GetNewChildDirentsForNewDirent/GetNewChildDirentsForNewDirent.ts'

test.skip('getNewChildDirentsForNewDirent - empty directory', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const items = [
    {
      depth: 1,
      name: 'folder',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.DirectoryExpanded,
      uri: '/root/folder',
    },
  ]

  const result = await getNewChildDirentsForNewDirent(items, 2, '/root/folder', DirentType.File)

  expect(result).toEqual([
    {
      depth: 2,
      name: '',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.File,
      uri: '',
    },
  ])
  expect(mockRpc.invocations).toEqual([])
})

test.skip('getNewChildDirentsForNewDirent - directory with existing children', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const items = [
    {
      depth: 1,
      name: 'folder',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.DirectoryExpanded,
      uri: '/root/folder',
    },
    {
      depth: 2,
      name: 'file1.txt',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: DirentType.File,
      uri: '/root/folder/file1.txt',
    },
    {
      depth: 2,
      name: 'file2.txt',
      posInSet: 2,
      selected: false,
      setSize: 2,
      type: DirentType.File,
      uri: '/root/folder/file2.txt',
    },
  ]

  const result = await getNewChildDirentsForNewDirent(items, 2, '/root/folder', DirentType.File)

  expect(result).toEqual([
    {
      depth: 2,
      name: 'file1.txt',
      posInSet: 1,
      selected: false,
      setSize: 3,
      type: DirentType.File,
      uri: '/root/folder/file1.txt',
    },
    {
      depth: 2,
      name: 'file2.txt',
      posInSet: 2,
      selected: false,
      setSize: 3,
      type: DirentType.File,
      uri: '/root/folder/file2.txt',
    },
    {
      depth: 2,
      name: '',
      posInSet: 3,
      selected: false,
      setSize: 3,
      type: DirentType.File,
      uri: '',
    },
  ])
  expect(mockRpc.invocations).toEqual([])
})

test.skip('getNewChildDirentsForNewDirent - directory with no children', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const items = [
    {
      depth: 1,
      name: 'folder',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.DirectoryExpanded,
      uri: '/root/folder',
    },
  ]

  const result = await getNewChildDirentsForNewDirent(items, 2, '/root/folder', DirentType.DirectoryExpanded)

  expect(result).toEqual([
    {
      depth: 2,
      name: '',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.DirectoryExpanded,
      uri: '',
    },
  ])
  expect(mockRpc.invocations).toEqual([])
})

test.skip('getNewChildDirentsForNewDirent - different dirent types', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const items = [
    {
      depth: 1,
      name: 'folder',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.DirectoryExpanded,
      uri: '/root/folder',
    },
    {
      depth: 2,
      name: 'file1.txt',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: DirentType.File,
      uri: '/root/folder/file1.txt',
    },
    {
      depth: 2,
      name: 'folder1',
      posInSet: 2,
      selected: false,
      setSize: 2,
      type: DirentType.DirectoryExpanded,
      uri: '/root/folder/folder1',
    },
  ]

  const result = await getNewChildDirentsForNewDirent(items, 2, '/root/folder', DirentType.SymLinkFolder)

  expect(result).toEqual([
    {
      depth: 2,
      name: 'file1.txt',
      posInSet: 1,
      selected: false,
      setSize: 4,
      type: DirentType.File,
      uri: '/root/folder/file1.txt',
    },
    {
      depth: 2,
      name: 'folder1',
      posInSet: 2,
      selected: false,
      setSize: 4,
      type: DirentType.DirectoryExpanded,
      uri: '/root/folder/folder1',
    },
    {
      depth: 2,
      name: '',
      posInSet: 3,
      selected: false,
      setSize: 4,
      type: DirentType.SymLinkFolder,
      uri: '',
    },
  ])
  expect(mockRpc.invocations).toEqual([])
})

test.skip('getNewChildDirentsForNewDirent - error case', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      throw new Error('Failed to read directory')
    },
  })

  const items = [
    {
      depth: 1,
      name: 'folder',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.DirectoryExpanded,
      uri: '/root/folder',
    },
  ]

  await expect(getNewChildDirentsForNewDirent(items, 2, '/root/folder', DirentType.File)).rejects.toThrow('Failed to read directory')
  expect(mockRpc.invocations).toEqual([])
})
