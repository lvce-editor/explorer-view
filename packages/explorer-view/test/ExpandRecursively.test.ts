import { test, expect } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as RpcRegistry from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { Directory, File } from '../src/parts/DirentType/DirentType.ts'
import { expandRecursively } from '../src/parts/ExpandRecursively/ExpandRecursively.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'

test.skip('expand root directory', async () => {
  const mockRpc = await MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return Promise.resolve([
          { name: 'file1.txt', type: 'file', isSymbolicLink: false },
          { name: 'dir1', type: 'directory', isSymbolicLink: false },
        ])
      }
      if (method === 'FileSystem.getPathSeparator') {
        return Promise.resolve('/')
      }
      if (method === 'IconTheme.getFolderIcon') {
        return Promise.resolve('folder-icon')
      }
      if (method === 'IconTheme.getFileIcon') {
        return Promise.resolve('file-icon')
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)
  const state = {
    ...createDefaultState(),
    root: '/test',
  }
  const newState = await expandRecursively(state)
  expect(newState.items).toHaveLength(2)
  expect(newState.items[0].name).toBe('file1.txt')
  expect(newState.items[1].name).toBe('dir1')
})

test.skip('expand focused directory', async () => {
  const mockRpc = await MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return Promise.resolve([
          { name: 'file1.txt', type: 'file', isSymbolicLink: false },
          { name: 'file2.txt', type: 'file', isSymbolicLink: false },
        ])
      }
      if (method === 'FileSystem.getPathSeparator') {
        return Promise.resolve('/')
      }
      if (method === 'IconTheme.getFolderIcon') {
        return Promise.resolve('folder-icon')
      }
      if (method === 'IconTheme.getFileIcon') {
        return Promise.resolve('file-icon')
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state = {
    ...createDefaultState(),
    items: [
      {
        name: 'test',
        type: Directory,
        path: '/test',
        depth: 0,
      },
    ],
    focusedIndex: 0,
  }
  const newState = await expandRecursively(state)
  expect(newState.items).toHaveLength(2)
  expect(newState.items[0].name).toBe('file1.txt')
  expect(newState.items[1].name).toBe('file2.txt')
})

test('do not expand file', async () => {
  const state = {
    ...createDefaultState(),
    items: [
      {
        name: 'test.txt',
        type: File,
        path: '/test.txt',
        depth: 0,
      },
    ],
    focusedIndex: 0,
  }
  const newState = await expandRecursively(state)
  expect(newState.items).toHaveLength(1)
  expect(newState.items[0].type).toBe(File)
})
