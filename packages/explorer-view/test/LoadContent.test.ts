import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { Directory, File } from '../src/parts/DirentType/DirentType.ts'
import { loadContent } from '../src/parts/LoadContent/LoadContent.ts'

test('loadContent keeps empty workspaces writable', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.isReadonly'() {
      return true
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getPath'() {
      return ''
    },
  })

  const result = await loadContent(createDefaultState(), undefined)

  expect(result.isReadonly).toBe(false)
  expect(mockRpc.invocations).not.toContainEqual(['FileSystem.isReadonly', ''])
})

test('loadContent applies files.exclude before computing aria metadata', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
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
    'Workspace.getPath'() {
      return '/workspace'
    },
  })

  const result = await loadContent(createDefaultState(), undefined)

  expect(result.excluded).toEqual(['**/.git', '**/*.tmp'])
  expect(result.items).toEqual([
    { depth: 1, icon: '', name: 'a.txt', path: '/workspace/a.txt', posInSet: 1, setSize: 2, type: File },
    { depth: 1, icon: '', name: 'c.txt', path: '/workspace/c.txt', posInSet: 2, setSize: 2, type: File },
  ])
  expect(mockRpc.invocations).toContainEqual(['Preferences.get', 'files.exclude'])
})

test('loadContent clamps restored deltaY to 0 when content is shorter after reload', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
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
    'Workspace.getPath'() {
      return '/workspace'
    },
  })
  const state: ExplorerState = createDefaultState()

  const result = await loadContent(state, {
    deltaY: 4800,
    expandedPaths: [],
    minLineY: 240,
    root: '/workspace',
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
        path: '/workspace/folder1',
        posInSet: 1,
        setSize: 2,
        type: Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder2',
        path: '/workspace/folder2',
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
    ['Preferences.get', 'explorer.sourceControlDecorations'],
    ['Workspace.getPath'],
    ['FileSystem.getPathSeparator', '/workspace'],
    ['FileSystem.isReadonly', '/workspace'],
    ['FileSystem.readDirWithFileTypes', '/workspace'],
  ])
})

test('loadContent clamps restored deltaY to maxDeltaY when content is still scrollable', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
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
    'Workspace.getPath'() {
      return '/workspace'
    },
  })
  const state: ExplorerState = createDefaultState()

  const result = await loadContent(state, {
    deltaY: 4800,
    expandedPaths: [],
    minLineY: 240,
    root: '/workspace',
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
      { depth: 1, icon: '', name: 'file1', path: '/workspace/file1', posInSet: 1, setSize: 8, type: File },
      { depth: 1, icon: '', name: 'file2', path: '/workspace/file2', posInSet: 2, setSize: 8, type: File },
      { depth: 1, icon: '', name: 'file3', path: '/workspace/file3', posInSet: 3, setSize: 8, type: File },
      { depth: 1, icon: '', name: 'file4', path: '/workspace/file4', posInSet: 4, setSize: 8, type: File },
      { depth: 1, icon: '', name: 'file5', path: '/workspace/file5', posInSet: 5, setSize: 8, type: File },
      { depth: 1, icon: '', name: 'file6', path: '/workspace/file6', posInSet: 6, setSize: 8, type: File },
      { depth: 1, icon: '', name: 'file7', path: '/workspace/file7', posInSet: 7, setSize: 8, type: File },
      { depth: 1, icon: '', name: 'file8', path: '/workspace/file8', posInSet: 8, setSize: 8, type: File },
    ],
    minLineY: 3,
  })
  expect(mockRpc.invocations).toEqual([
    ['Preferences.get', 'explorer.useChevrons'],
    ['Preferences.get', 'explorer.confirmdelete'],
    ['Preferences.get', 'explorer.confirmpaste'],
    ['Preferences.get', 'files.exclude'],
    ['Preferences.get', 'explorer.gitIgnoreDecorations'],
    ['Preferences.get', 'explorer.sourceControlDecorations'],
    ['Workspace.getPath'],
    ['FileSystem.getPathSeparator', '/workspace'],
    ['FileSystem.isReadonly', '/workspace'],
    ['FileSystem.readDirWithFileTypes', '/workspace'],
  ])
})
