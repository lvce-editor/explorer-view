import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getChildDirentsRecursively } from '../src/parts/GetChildDirentsRecursively/GetChildDirentsRecursively.ts'

test('getChildDirentsRecursively - file', async () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'test.txt',
    path: '/test.txt',
    selected: false,
    type: DirentType.File,
  }
  const result = await getChildDirentsRecursively(dirent, '/')
  expect(result).toEqual([dirent])
})

test('getChildDirentsRecursively - directory with no children', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'empty-dir',
    path: '/empty-dir',
    selected: false,
    type: DirentType.Directory,
  }
  const result = await getChildDirentsRecursively(dirent, '/')
  expect(result).toHaveLength(1)
  expect(result[0].name).toBe('empty-dir')
  expect(result[0].type).toBe(DirentType.DirectoryExpanded)
})

test('getChildDirentsRecursively - directory with one file', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path?: string) {
      if (path === '/test-dir') {
        return [{ isSymbolicLink: false, name: 'file1.txt', type: 'file' }]
      }
      return []
    },
  })
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'test-dir',
    path: '/test-dir',
    selected: false,
    type: DirentType.Directory,
  }
  const result = await getChildDirentsRecursively(dirent, '/')
  expect(result).toHaveLength(2)
  expect(result[0].name).toBe('test-dir')
  expect(result[0].type).toBe(DirentType.DirectoryExpanded)
  expect(result[1].name).toBe('file1.txt')
  expect(result[1].type).toBe(DirentType.File)
})

test('getChildDirentsRecursively - directory with nested directory', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path?: string) {
      if (path === '/parent-dir') {
        return [{ isSymbolicLink: false, name: 'child-dir', type: 'directory' }]
      }
      if (path === '/parent-dir/child-dir') {
        return [{ isSymbolicLink: false, name: 'nested-file.txt', type: 'file' }]
      }
      return []
    },
  })
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'parent-dir',
    path: '/parent-dir',
    selected: false,
    type: DirentType.Directory,
  }
  const result = await getChildDirentsRecursively(dirent, '/')
  expect(result).toHaveLength(3)
  expect(result[0].name).toBe('parent-dir')
  expect(result[0].type).toBe(DirentType.DirectoryExpanded)
  expect(result[1].name).toBe('child-dir')
  expect(result[1].type).toBe(DirentType.DirectoryExpanded)
  expect(result[2].name).toBe('nested-file.txt')
  expect(result[2].type).toBe(DirentType.File)
})

test('getChildDirentsRecursively - directory with multiple children', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path?: string) {
      if (path === '/parent-dir') {
        return [
          { isSymbolicLink: false, name: 'file1.txt', type: 'file' },
          { isSymbolicLink: false, name: 'file2.txt', type: 'file' },
          { isSymbolicLink: false, name: 'subdir', type: 'directory' },
        ]
      }
      if (path === '/parent-dir/subdir') {
        return [{ isSymbolicLink: false, name: 'nested-file.txt', type: 'file' }]
      }
      return []
    },
  })
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'parent-dir',
    path: '/parent-dir',
    selected: false,
    type: DirentType.Directory,
  }
  const result = await getChildDirentsRecursively(dirent, '/')
  expect(result).toHaveLength(4)
  expect(result[0].name).toBe('parent-dir')
  expect(result[0].type).toBe(DirentType.DirectoryExpanded)
  expect(result[1].name).toBe('file1.txt')
  expect(result[1].type).toBe(DirentType.File)
  expect(result[2].name).toBe('file2.txt')
  expect(result[2].type).toBe(DirentType.File)
  expect(result[3].name).toBe('subdir')
  expect(result[3].type).toBe(DirentType.DirectoryExpanded)
})

test('getChildDirentsRecursively - DirectoryExpanded', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path?: string) {
      if (path === '/test-dir') {
        return [{ isSymbolicLink: false, name: 'file1.txt', type: 'file' }]
      }
      return []
    },
  })
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'test-dir',
    path: '/test-dir',
    selected: false,
    type: DirentType.DirectoryExpanded,
  }
  const result = await getChildDirentsRecursively(dirent, '/')
  expect(result).toHaveLength(2)
  expect(result[0].name).toBe('test-dir')
  expect(result[0].type).toBe(DirentType.DirectoryExpanded)
  expect(result[1].name).toBe('file1.txt')
  expect(result[1].type).toBe(DirentType.File)
})

test('getChildDirentsRecursively - DirectoryExpanding', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path?: string) {
      if (path === '/test-dir') {
        return [{ isSymbolicLink: false, name: 'file1.txt', type: 'file' }]
      }
      return []
    },
  })
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'test-dir',
    path: '/test-dir',
    selected: false,
    type: DirentType.DirectoryExpanding,
  }
  const result = await getChildDirentsRecursively(dirent, '/')
  expect(result).toHaveLength(2)
  expect(result[0].name).toBe('test-dir')
  expect(result[0].type).toBe(DirentType.DirectoryExpanded)
  expect(result[1].name).toBe('file1.txt')
  expect(result[1].type).toBe(DirentType.File)
})

test('getChildDirentsRecursively - unknown type returns empty array', async () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'unknown',
    path: '/unknown',
    selected: false,
    type: DirentType.Unknown,
  }
  const result = await getChildDirentsRecursively(dirent, '/')
  expect(result).toEqual([])
})

test('getChildDirentsRecursively - symlink file', async () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'symlink.txt',
    path: '/symlink.txt',
    selected: false,
    type: DirentType.SymLinkFile,
  }
  const result = await getChildDirentsRecursively(dirent, '/')
  expect(result).toEqual([dirent])
})

test('getChildDirentsRecursively - symlink folder', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path?: string) {
      if (path === '/symlink-dir') {
        return [{ isSymbolicLink: false, name: 'file1.txt', type: 'file' }]
      }
      return []
    },
  })
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'symlink-dir',
    path: '/symlink-dir',
    selected: false,
    type: DirentType.SymLinkFolder,
  }
  const result = await getChildDirentsRecursively(dirent, '/')
  expect(result).toHaveLength(2)
  expect(result[0].name).toBe('symlink-dir')
  expect(result[0].type).toBe(DirentType.DirectoryExpanded)
  expect(result[1].name).toBe('file1.txt')
  expect(result[1].type).toBe(DirentType.File)
})

test('getChildDirentsRecursively - deep nesting', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path?: string) {
      if (path === '/level1') {
        return [{ isSymbolicLink: false, name: 'level2', type: 'directory' }]
      }
      if (path === '/level1/level2') {
        return [{ isSymbolicLink: false, name: 'level3', type: 'directory' }]
      }
      if (path === '/level1/level2/level3') {
        return [{ isSymbolicLink: false, name: 'deep-file.txt', type: 'file' }]
      }
      return []
    },
  })
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'level1',
    path: '/level1',
    selected: false,
    type: DirentType.Directory,
  }
  const result = await getChildDirentsRecursively(dirent, '/')
  expect(result).toHaveLength(4)
  expect(result[0].name).toBe('level1')
  expect(result[0].type).toBe(DirentType.DirectoryExpanded)
  expect(result[1].name).toBe('level2')
  expect(result[1].type).toBe(DirentType.DirectoryExpanded)
  expect(result[2].name).toBe('level3')
  expect(result[2].type).toBe(DirentType.DirectoryExpanded)
  expect(result[3].name).toBe('deep-file.txt')
  expect(result[3].type).toBe(DirentType.File)
})

test('getChildDirentsRecursively - backslash path separator', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path?: string) {
      if (path === 'C:\\test-dir') {
        return [{ isSymbolicLink: false, name: 'file1.txt', type: 'file' }]
      }
      return []
    },
  })
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'test-dir',
    path: 'C:\\test-dir',
    selected: false,
    type: DirentType.Directory,
  }
  const result = await getChildDirentsRecursively(dirent, '\\')
  expect(result).toHaveLength(2)
  expect(result[0].name).toBe('test-dir')
  expect(result[0].type).toBe(DirentType.DirectoryExpanded)
  expect(result[1].name).toBe('file1.txt')
  expect(result[1].type).toBe(DirentType.File)
})
