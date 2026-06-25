import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as FileOperationType from '../src/parts/FileOperationType/FileOperationType.ts'
import { getUndoOperationsForDelete } from '../src/parts/GetUndoOperationsForDelete/GetUndoOperationsForDelete.ts'

test.skip('getUndoOperationsForDelete - folder snapshot', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === '/workspace/folder') {
        return [
          { name: 'nested', type: DirentType.Directory },
          { name: 'root.txt', type: DirentType.File },
        ]
      }
      if (path === '/workspace/folder/nested') {
        return [{ name: 'child.txt', type: DirentType.File }]
      }
      return []
    },
  })

  const result = await getUndoOperationsForDelete(
    [{ depth: 0, name: 'folder', path: '/workspace/folder', selected: false, type: DirentType.DirectoryExpanded }],
    '/',
  )
  expect(result).toEqual([
    { path: '/workspace/folder', type: FileOperationType.CreateFolder },
    { path: '/workspace/folder/nested', type: FileOperationType.CreateFolder },
    { path: '/workspace/folder/nested/child.txt', text: '', type: FileOperationType.CreateFile },
    { path: '/workspace/folder/root.txt', text: '', type: FileOperationType.CreateFile },
  ])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', '/workspace/folder'],
    ['FileSystem.readDirWithFileTypes', '/workspace/folder/nested'],
  ])
})
