import { beforeEach, expect, jest, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import * as PathSeparatorType from '../src/parts/PathSeparatorType/PathSeparatorType.ts'
import { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'

beforeEach(() => {
  jest.resetAllMocks()
})

// TODO don't mock file system, register mockrpc instead
jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.ts', () => {
  return {
    rename: jest.fn(() => {
      throw new Error('not implemented')
    }),
    writeFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
    copy: jest.fn(() => {
      throw new Error('not implemented')
    }),
    remove: jest.fn(() => {
      throw new Error('not implemented')
    }),
    readDirWithFileTypes: jest.fn(() => {
      throw new Error('not implemented')
    }),
    mkdir: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getPathSeparator: (): string => {
      return '/'
    },
    getRealPath: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ViewletExplorer = await import('../src/parts/Create/Create.ts')
const ViewletExplorerAcceptEdit = await import('../src/parts/AcceptEdit/AcceptEdit.ts')
const FileSystem = await import('../src/parts/FileSystem/FileSystem.ts')

test.skip('acceptEdit - rename', async () => {
  // @ts-ignore
  FileSystem.rename.mockImplementation(() => {})
  const state: ExplorerState = {
    ...ViewletExplorer.create(1, '', 0, 0, 0, 0, [], 0),
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 1,
    maxLineY: 2,
    root: '/test',
    pathSeparator: PathSeparatorType.Slash,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'a.txt',
        path: '/test/a.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
    editingIndex: 0,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'b.txt',
  }
  expect(await ViewletExplorerAcceptEdit.acceptEdit(state)).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'b.txt',
        path: '/test/b.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  })
  expect(FileSystem.rename).toHaveBeenCalledTimes(1)
  expect(FileSystem.rename).toHaveBeenCalledWith('/test/a.txt', '/test/b.txt')
})

test.skip('acceptEdit - rename - nested file', async () => {
  // @ts-ignore
  FileSystem.rename.mockImplementation(() => {})
  const state: ExplorerState = {
    ...ViewletExplorer.create(1, '', 0, 0, 0, 0, [], 0),
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 1,
    maxLineY: 2,
    root: '/test',
    pathSeparator: PathSeparatorType.Slash,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 1,
        type: DirentType.Directory,
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/test/a/b.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
    editingIndex: 1,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'c.txt',
  }
  expect(await ViewletExplorerAcceptEdit.acceptEdit(state)).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 1,
        type: DirentType.Directory,
      },
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/test/a/c.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
    focusedIndex: 1,
  })
})

test.skip('acceptEdit - create - insert folder', async () => {
  // @ts-ignore
  FileSystem.mkdir.mockImplementation(() => {})
  const state: ExplorerState = {
    ...ViewletExplorer.create(1, '', 0, 0, 0, 0, [], 0),
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 1,
    maxLineY: 2,
    root: '/test',
    pathSeparator: PathSeparatorType.Slash,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'b',
        path: '/test/b',
        posInSet: 2,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'd',
        path: '/test/d',
        posInSet: 3,
        setSize: 3,
        type: DirentType.Directory,
      },
    ],
    editingIndex: 0,
    editingType: ExplorerEditingType.CreateFolder,
    editingValue: 'c',
  }
  expect(await ViewletExplorerAcceptEdit.acceptEdit(state)).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 4,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'b',
        path: '/test/b',
        posInSet: 2,
        setSize: 4,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'c',
        path: '/test/c',
        posInSet: 3,
        setSize: 4,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'd',
        path: '/test/d',
        posInSet: 3, // TODO should be 4
        setSize: 3, // TODO should be 4
        type: DirentType.Directory,
      },
    ],
    focusedIndex: 2,
  })
})
