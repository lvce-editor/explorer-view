import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleInternalDrop } from '../src/parts/HandleInternalDrop/HandleInternalDrop.ts'

test('moves a workspace file into a folder and expands the target', async () => {
  let moved = false
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === '/workspace') {
        return [{ name: 'src', type: DirentType.Directory }, ...(moved ? [] : [{ name: 'Main.elm', type: DirentType.File }])]
      }
      if (path === '/workspace/src') {
        return moved ? [{ name: 'Main.elm', type: DirentType.File }] : []
      }
      return []
    },
    'FileSystem.rename'() {
      moved = true
    },
  })
  const state = {
    ...createDefaultState(),
    dropTargets: [0],
    items: [
      { depth: 1, name: 'src', selected: false, type: DirentType.Directory, uri: '/workspace/src' },
      { depth: 1, name: 'Main.elm', selected: false, type: DirentType.File, uri: '/workspace/Main.elm' },
    ],
    root: '/workspace',
  }

  const result = await handleInternalDrop(state, ['/workspace/Main.elm'], 0)

  expect(result.dropTargets).toEqual([])
  expect(result.items).toEqual([
    expect.objectContaining({ name: 'src', type: DirentType.DirectoryExpanded, uri: '/workspace/src' }),
    expect.objectContaining({ name: 'Main.elm', type: DirentType.File, uri: '/workspace/src/Main.elm' }),
  ])
  expect(mockRpc.invocations).toContainEqual(['FileSystem.rename', '/workspace/Main.elm', '/workspace/src/Main.elm'])
})

test('does not move a file when it is already in the target folder', async () => {
  const state = {
    ...createDefaultState(),
    dropTargets: [0],
    items: [
      { depth: 1, name: 'src', selected: false, type: DirentType.DirectoryExpanded, uri: '/workspace/src' },
      { depth: 2, name: 'Main.elm', selected: false, type: DirentType.File, uri: '/workspace/src/Main.elm' },
    ],
    root: '/workspace',
  }

  const result = await handleInternalDrop(state, ['/workspace/src/Main.elm'], 0)

  expect(result).toEqual({ ...state, dropTargets: [] })
})

test('rejects moving a folder into its descendant before changing the file system', async () => {
  const state = {
    ...createDefaultState(),
    items: [
      { depth: 1, name: 'folder', selected: false, type: DirentType.DirectoryExpanded, uri: '/workspace/folder' },
      { depth: 2, name: 'child', selected: false, type: DirentType.Directory, uri: '/workspace/folder/child' },
    ],
    root: '/workspace',
  }

  await expect(handleInternalDrop(state, ['/workspace/folder'], 1)).rejects.toThrow('Cannot move folder folder into a subfolder of itself')
})

test('rejects a visible destination collision before changing the file system', async () => {
  const state = {
    ...createDefaultState(),
    items: [
      { depth: 1, name: 'src', selected: false, type: DirentType.DirectoryExpanded, uri: '/workspace/src' },
      { depth: 2, name: 'Main.elm', selected: false, type: DirentType.File, uri: '/workspace/src/Main.elm' },
      { depth: 1, name: 'Main.elm', selected: false, type: DirentType.File, uri: '/workspace/Main.elm' },
    ],
    root: '/workspace',
  }

  await expect(handleInternalDrop(state, ['/workspace/Main.elm'], 0)).rejects.toThrow(
    'A file or folder **Main.elm** already exists at this location. Please choose a different name.',
  )
})
