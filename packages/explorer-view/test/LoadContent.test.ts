import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { Directory, DirectoryExpanded, File } from '../src/parts/DirentType/DirentType.ts'
import { loadContent } from '../src/parts/LoadContent/LoadContent.ts'

test('loadContent keeps empty workspaces writable', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.isReadonly'() {
      return true
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getUri'() {
      return ''
    },
  })

  const result = await loadContent(createDefaultState(), undefined)

  expect(result.isReadonly).toBe(false)
  expect(mockRpc.invocations).not.toContainEqual(['FileSystem.isReadonly', ''])
})

test('loadContent applies files.exclude before computing aria metadata', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.isReadonly'() {
      return false
    },
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: '.git', type: Directory },
        { name: 'a.txt', type: File },
        { name: 'b.tmp', type: File },
        { name: 'c.txt', type: File },
      ]
    },
    'Preferences.get'(key: string) {
      return key === 'files.exclude' ? { '**/.git': true, '**/*.tmp': true } : false
    },
    'Workspace.getUri'() {
      return 'file:///workspace'
    },
  })

  const result = await loadContent(createDefaultState(), undefined)

  expect(result.excluded).toEqual(['**/.git', '**/*.tmp'])
  expect(result.pathSeparator).toBe('/')
  expect(result.items).toEqual([
    { depth: 1, icon: '', name: 'a.txt', path: 'file:///workspace/a.txt', posInSet: 1, setSize: 2, type: File },
    { depth: 1, icon: '', name: 'c.txt', path: 'file:///workspace/c.txt', posInSet: 2, setSize: 2, type: File },
  ])
  expect(mockRpc.invocations).toContainEqual(['Preferences.get', 'files.exclude'])
})

test('loadContent clamps restored deltaY to 0 when content is shorter after reload', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.isReadonly'() {
      return false
    },
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'folder1', type: Directory },
        { name: 'folder2', type: Directory },
      ]
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getUri'() {
      return 'file:///workspace'
    },
  })
  const state: ExplorerState = createDefaultState()

  const result = await loadContent(state, {
    deltaY: 4800,
    expandedPaths: [],
    minLineY: 240,
    root: 'file:///workspace',
  })

  expect({
    deltaY: result.deltaY,
    items: result.items,
    minLineY: result.minLineY,
  }).toEqual({
    deltaY: 0,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder1',
        path: 'file:///workspace/folder1',
        posInSet: 1,
        setSize: 2,
        type: Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder2',
        path: 'file:///workspace/folder2',
        posInSet: 2,
        setSize: 2,
        type: Directory,
      },
    ],
    minLineY: 0,
  })
  expect(mockRpc.invocations).toEqual([
    ['Preferences.get', 'explorer.useChevrons'],
    ['Preferences.get', 'explorer.confirmdelete'],
    ['Preferences.get', 'explorer.confirmpaste'],
    ['Preferences.get', 'files.exclude'],
    ['Preferences.get', 'explorer.gitIgnoreDecorations'],
    ['Preferences.get', 'explorer.preserveExpandState'],
    ['Preferences.get', 'explorer.sourceControlDecorations'],
    ['Workspace.getUri'],
    ['FileSystem.isReadonly', 'file:///workspace'],
    ['FileSystem.readDirWithFileTypes', 'file:///workspace'],
  ])
})

test('loadContent clamps restored deltaY to maxDeltaY when content is still scrollable', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.isReadonly'() {
      return true
    },
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'file1', type: File },
        { name: 'file2', type: File },
        { name: 'file3', type: File },
        { name: 'file4', type: File },
        { name: 'file5', type: File },
        { name: 'file6', type: File },
        { name: 'file7', type: File },
        { name: 'file8', type: File },
      ]
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getUri'() {
      return 'file:///workspace'
    },
  })
  const state: ExplorerState = createDefaultState()

  const result = await loadContent(state, {
    deltaY: 4800,
    expandedPaths: [],
    minLineY: 240,
    root: 'file:///workspace',
  })

  expect({
    deltaY: result.deltaY,
    isReadonly: result.isReadonly,
    items: result.items,
    minLineY: result.minLineY,
  }).toEqual({
    deltaY: 60,
    isReadonly: true,
    items: [
      { depth: 1, icon: '', name: 'file1', path: 'file:///workspace/file1', posInSet: 1, setSize: 8, type: File },
      { depth: 1, icon: '', name: 'file2', path: 'file:///workspace/file2', posInSet: 2, setSize: 8, type: File },
      { depth: 1, icon: '', name: 'file3', path: 'file:///workspace/file3', posInSet: 3, setSize: 8, type: File },
      { depth: 1, icon: '', name: 'file4', path: 'file:///workspace/file4', posInSet: 4, setSize: 8, type: File },
      { depth: 1, icon: '', name: 'file5', path: 'file:///workspace/file5', posInSet: 5, setSize: 8, type: File },
      { depth: 1, icon: '', name: 'file6', path: 'file:///workspace/file6', posInSet: 6, setSize: 8, type: File },
      { depth: 1, icon: '', name: 'file7', path: 'file:///workspace/file7', posInSet: 7, setSize: 8, type: File },
      { depth: 1, icon: '', name: 'file8', path: 'file:///workspace/file8', posInSet: 8, setSize: 8, type: File },
    ],
    minLineY: 3,
  })
  expect(mockRpc.invocations).toEqual([
    ['Preferences.get', 'explorer.useChevrons'],
    ['Preferences.get', 'explorer.confirmdelete'],
    ['Preferences.get', 'explorer.confirmpaste'],
    ['Preferences.get', 'files.exclude'],
    ['Preferences.get', 'explorer.gitIgnoreDecorations'],
    ['Preferences.get', 'explorer.preserveExpandState'],
    ['Preferences.get', 'explorer.sourceControlDecorations'],
    ['Workspace.getUri'],
    ['FileSystem.isReadonly', 'file:///workspace'],
    ['FileSystem.readDirWithFileTypes', 'file:///workspace'],
  ])
})

test('loadContent reapplies the current workspace expand state when rebuilding without saved state', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.isReadonly'() {
      return false
    },
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === 'file:///workspace') {
        return [{ name: 'outer', type: Directory }]
      }
      if (path === 'file:///workspace/outer') {
        return [{ name: 'inner', type: Directory }]
      }
      if (path === 'file:///workspace/outer/inner') {
        return [{ name: 'file.txt', type: File }]
      }
      return []
    },
    'Preferences.get'(key: string) {
      return key === 'explorer.preserveExpandState'
    },
    'Workspace.getUri'() {
      return 'file:///workspace'
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    expandedPaths: ['file:///workspace/outer', 'file:///workspace/outer/inner'],
    root: 'file:///workspace',
  }
  const { expandedPaths } = state

  const result = await loadContent(state, undefined)

  expect(result.items).toEqual([
    expect.objectContaining({ path: 'file:///workspace/outer', type: DirectoryExpanded }),
    expect.objectContaining({ path: 'file:///workspace/outer/inner', type: DirectoryExpanded }),
    expect.objectContaining({ path: 'file:///workspace/outer/inner/file.txt', type: File }),
  ])
  expect(result.expandedPaths).toEqual(expandedPaths)
  expect(mockRpc.invocations).toContainEqual(['FileSystem.readDirWithFileTypes', 'file:///workspace/outer/inner'])
})
