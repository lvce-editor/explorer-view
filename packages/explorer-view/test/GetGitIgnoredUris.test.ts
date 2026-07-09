import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getGitIgnoredUris } from '../src/parts/GetGitIgnoredUris/GetGitIgnoredUris.ts'

test('getGitIgnoredUris reads root gitignore and matches items', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile'(path: string) {
      if (path === '/workspace/.gitignore') {
        return '*.log'
      }
      throw new Error('not found')
    },
  })
  const result = await getGitIgnoredUris(
    '/workspace',
    [
      { depth: 1, name: 'debug.log', path: '/workspace/debug.log', selected: false, type: DirentType.File },
      { depth: 1, name: 'keep.txt', path: '/workspace/keep.txt', selected: false, type: DirentType.File },
    ],
    '/',
    true,
  )
  expect(result).toEqual(['/workspace/debug.log'])
  expect(mockRpc.invocations).toEqual([['FileSystem.readFile', '/workspace/.gitignore']])
})

test('getGitIgnoredUris reads nested gitignore files', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile'(path: string) {
      if (path === '/workspace/.gitignore') {
        return ''
      }
      if (path === '/workspace/packages/app/.gitignore') {
        return '*.tmp'
      }
      throw new Error('not found')
    },
  })
  const result = await getGitIgnoredUris(
    '/workspace',
    [
      { depth: 1, name: 'packages', path: '/workspace/packages', selected: false, type: DirentType.DirectoryExpanded },
      { depth: 2, name: 'app', path: '/workspace/packages/app', selected: false, type: DirentType.DirectoryExpanded },
      { depth: 3, name: 'file.tmp', path: '/workspace/packages/app/file.tmp', selected: false, type: DirentType.File },
      { depth: 2, name: 'file.tmp', path: '/workspace/packages/file.tmp', selected: false, type: DirentType.File },
    ],
    '/',
    true,
  )
  expect(result).toEqual(['/workspace/packages/app/file.tmp'])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readFile', '/workspace/.gitignore'],
    ['FileSystem.readFile', '/workspace/packages/.gitignore'],
    ['FileSystem.readFile', '/workspace/packages/app/.gitignore'],
  ])
})

test('getGitIgnoredUris does not read gitignore files from collapsed folders', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile'(path: string) {
      if (path === '/workspace/.gitignore') {
        return 'build/'
      }
      throw new Error('not found')
    },
  })
  const result = await getGitIgnoredUris(
    '/workspace',
    [
      { depth: 1, name: 'packages', path: '/workspace/packages', selected: false, type: DirentType.Directory },
      { depth: 1, name: 'build', path: '/workspace/build', selected: false, type: DirentType.Directory },
    ],
    '/',
    true,
  )
  expect(result).toEqual(['/workspace/build'])
  expect(mockRpc.invocations).toEqual([['FileSystem.readFile', '/workspace/.gitignore']])
})

test('getGitIgnoredUris returns empty when disabled', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile'() {
      throw new Error('should not be called')
    },
  })
  const result = await getGitIgnoredUris(
    '/workspace',
    [{ depth: 1, name: 'debug.log', path: '/workspace/debug.log', selected: false, type: DirentType.File }],
    '/',
    false,
  )
  expect(result).toEqual([])
  expect(mockRpc.invocations).toEqual([])
})
