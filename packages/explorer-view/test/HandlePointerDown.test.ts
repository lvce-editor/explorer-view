import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'
import { handleClickDirectory } from '../src/parts/HandleClickDirectory/HandleClickDirectory.ts'
import { handlePointerDown } from '../src/parts/HandlePointerDown/HandlePointerDown.ts'
import { handlePointerUp } from '../src/parts/HandlePointerUp/HandlePointerUp.ts'
import * as MouseEventType from '../src/parts/MouseEventType/MouseEventType.ts'

test('left click outside items', () => {
  const state = createDefaultState()
  const result = handlePointerDown(state, MouseEventType.LeftClick, 100, 100)
  expect(result).toEqual({
    ...state,
    focus: FocusId.List,
    focused: true,
    focusedIndex: -1,
  })
})

test.skip('right click outside items', () => {
  const state = createDefaultState()
  const result = handlePointerDown(state, 2, 100, 100)
  expect(result).toEqual({
    ...state,
    focusedIndex: -1,
  })
})

test('left click on item', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ depth: 0, name: 'test.txt', selected: false, type: DirentType.File, uri: '/test.txt' }],
  }
  const result = handlePointerDown(state, MouseEventType.LeftClick, 0, 0)
  expect(result).toEqual({
    ...state,
    isPointerDown: true,
    pointerDownIndex: 0,
  })
})

test('preloads a collapsed folder on pointer down and reuses the pending listing on expansion', async () => {
  const { promise: listing, resolve: resolveListing } = Promise.withResolvers<
    readonly {
      isDirectory: boolean
      isSymbolicLink: boolean
      name: string
      uri: string
    }[]
  >()
  let readCount = 0
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      readCount++
      return listing
    },
  })

  const dirent = { depth: 0, name: 'test', selected: false, type: DirentType.Directory, uri: '/test' }
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [dirent],
  }

  const pointerDownState = handlePointerDown(state, MouseEventType.LeftClick, 0, 0)
  expect(readCount).toBe(1)

  const pointerUpState = handlePointerUp(pointerDownState)
  const expansion = handleClickDirectory(pointerUpState, dirent, 0, true)
  expect(readCount).toBe(1)

  resolveListing([{ isDirectory: false, isSymbolicLink: false, name: 'child.txt', uri: '/test/child.txt' }])
  const expandedState = await expansion

  expect(expandedState.items.map((item) => item.uri)).toEqual(['/test', '/test/child.txt'])
  expect(readCount).toBe(1)
  expect(expandedState.directoryPreload).toBeUndefined()
})

test('falls back to a normal listing when a preloaded request rejects', async () => {
  let readCount = 0
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      readCount++
      if (readCount === 1) {
        return Promise.reject(new Error('temporary read failure'))
      }
      return Promise.resolve([{ isDirectory: false, isSymbolicLink: false, name: 'child.txt', uri: '/test/child.txt' }])
    },
  })

  const dirent = { depth: 0, name: 'test', selected: false, type: DirentType.Directory, uri: '/test' }
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [dirent],
  }
  const pointerDownState = handlePointerDown(state, MouseEventType.LeftClick, 0, 0)
  const expandedState = await handleClickDirectory(handlePointerUp(pointerDownState), dirent, 0, true)

  expect(expandedState.items.map((item) => item.uri)).toEqual(['/test', '/test/child.txt'])
  expect(readCount).toBe(2)
  expect(expandedState.directoryPreload).toBeUndefined()
})

test('reuses a preloaded parent while restoring expanded descendants', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(uri: string) {
      if (uri === '/test') {
        return [{ isDirectory: true, isSymbolicLink: false, name: 'nested', type: DirentType.Directory, uri: '/test/nested' }]
      }
      if (uri === '/test/nested') {
        return [{ isDirectory: false, isSymbolicLink: false, name: 'child.txt', type: DirentType.File, uri: '/test/nested/child.txt' }]
      }
      return []
    },
  })

  const dirent = { depth: 0, name: 'test', selected: false, type: DirentType.Directory, uri: '/test' }
  const state: ExplorerState = {
    ...createDefaultState(),
    expandedPaths: ['/test/nested'],
    items: [dirent],
  }
  const pointerDownState = handlePointerDown(state, MouseEventType.LeftClick, 0, 0)
  const expandedState = await handleClickDirectory(handlePointerUp(pointerDownState), dirent, 0, true)

  expect(expandedState.items.map((item) => item.uri)).toEqual(['/test', '/test/nested', '/test/nested/child.txt'])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', '/test'],
    ['FileSystem.readDirWithFileTypes', '/test/nested'],
  ])
})
