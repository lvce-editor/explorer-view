import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { Directory, DirectoryExpanded, File } from '../src/parts/DirentType/DirentType.ts'
import { restoreExpandedState } from '../src/parts/RestoreExpandedState/RestoreExpandedState.ts'

// Larger than engine-specific argument limits, including Node's larger stack than Chromium workers.
const fileCount = 200_000

test.each([false, true])('restoreExpandedState loads a large directory (nested: %s)', async (nested) => {
  const root = '/workspace'
  const directory = nested ? `${root}/folder` : root
  const files = Array.from({ length: fileCount }, (_, index) => ({
    name: `file-${(fileCount - index - 1).toString().padStart(6, '0')}.txt`,
    type: File,
  }))
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === directory) {
        return files
      }
      if (nested && path === root) {
        return [
          { name: 'z.txt', type: File },
          { name: 'folder', type: Directory },
        ]
      }
      throw new Error(`Unexpected directory: ${path}`)
    },
  })

  const items = await restoreExpandedState(nested ? [directory] : [], root, '/', [])

  expect(items).toHaveLength(fileCount + (nested ? 2 : 0))
  const firstFileIndex = nested ? 1 : 0
  expect(items[firstFileIndex]).toEqual({
    depth: nested ? 2 : 1,
    name: 'file-000000.txt',
    path: `${directory}/file-000000.txt`,
    posInSet: 1,
    setSize: fileCount,
    type: File,
  })
  expect(items[firstFileIndex + fileCount - 1]).toEqual({
    depth: nested ? 2 : 1,
    name: 'file-199999.txt',
    path: `${directory}/file-199999.txt`,
    posInSet: fileCount,
    setSize: fileCount,
    type: File,
  })
  const rootSiblings = nested ? [items[0], items.at(-1)] : []
  expect(rootSiblings).toEqual(
    nested
      ? [
          { depth: 1, name: 'folder', path: directory, posInSet: 1, setSize: 2, type: DirectoryExpanded },
          { depth: 1, name: 'z.txt', path: `${root}/z.txt`, posInSet: 2, setSize: 2, type: File },
        ]
      : [],
  )
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', root],
    ...(nested ? [['FileSystem.readDirWithFileTypes', directory]] : []),
  ])
})
