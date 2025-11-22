import { test, expect, jest } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { SourceControlWorker } from '@lvce-editor/rpc-registry'
import type { FileDecoration } from '../src/parts/FileDecoration/FileDecoration.ts'

test('getFileDecorations - returns empty array when decorationsEnabled is false', async () => {
  const { getFileDecorations } = await import('../src/parts/GetFileDecorations/GetFileDecorations.ts')
  const result = await getFileDecorations('file', '/root', ['/file1.txt'], false)
  expect(result).toEqual([])
})

test('getFileDecorations - returns empty array when no provider IDs', async () => {
  const invocations: any[] = []
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: any[]) => {
      invocations.push([method, ...args])
      if (method === 'SourceControl.getEnabledProviderIds') {
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  SourceControlWorker.set(mockRpc)

  const { getFileDecorations } = await import('../src/parts/GetFileDecorations/GetFileDecorations.ts')
  const result = await getFileDecorations('file', '/root', ['/file1.txt'], true)
  expect(result).toEqual([])
  expect(invocations).toEqual([['SourceControl.getEnabledProviderIds', 'file', '/root']])
})

test('getFileDecorations - returns decorations for single file', async () => {
  const decorations: FileDecoration[] = [{ uri: 'file:///file1.txt', type: 'modified' }]
  const invocations: any[] = []
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: any[]) => {
      invocations.push([method, ...args])
      if (method === 'SourceControl.getEnabledProviderIds') {
        return ['git']
      }
      if (method === 'SourceControl.getFileDecorations') {
        return decorations
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  SourceControlWorker.set(mockRpc)

  const { getFileDecorations } = await import('../src/parts/GetFileDecorations/GetFileDecorations.ts')
  const result = await getFileDecorations('file', '/root', ['/file1.txt'], true)
  expect(result).toEqual(decorations)
  expect(invocations).toEqual([
    ['SourceControl.getEnabledProviderIds', 'file', '/root'],
    ['SourceControl.getFileDecorations', 'git', ['file:///file1.txt']],
  ])
})

test('getFileDecorations - converts paths to URIs', async () => {
  const decorations: FileDecoration[] = [
    { uri: 'file:///file1.txt', type: 'modified' },
    { uri: 'file:///file2.txt', type: 'added' },
  ]
  const invocations: any[] = []
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: any[]) => {
      invocations.push([method, ...args])
      if (method === 'SourceControl.getEnabledProviderIds') {
        return ['git']
      }
      if (method === 'SourceControl.getFileDecorations') {
        return decorations
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  SourceControlWorker.set(mockRpc)

  const { getFileDecorations } = await import('../src/parts/GetFileDecorations/GetFileDecorations.ts')
  const result = await getFileDecorations('file', '/root', ['/file1.txt', '/file2.txt'], true)
  expect(result).toEqual(decorations)
  expect(invocations).toEqual([
    ['SourceControl.getEnabledProviderIds', 'file', '/root'],
    ['SourceControl.getFileDecorations', 'git', ['file:///file1.txt', 'file:///file2.txt']],
  ])
})

test('getFileDecorations - handles URIs that are already URIs', async () => {
  const decorations: FileDecoration[] = [{ uri: 'file:///file1.txt', type: 'modified' }]
  const invocations: any[] = []
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: any[]) => {
      invocations.push([method, ...args])
      if (method === 'SourceControl.getEnabledProviderIds') {
        return ['git']
      }
      if (method === 'SourceControl.getFileDecorations') {
        return decorations
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  SourceControlWorker.set(mockRpc)

  const { getFileDecorations } = await import('../src/parts/GetFileDecorations/GetFileDecorations.ts')
  const result = await getFileDecorations('file', '/root', ['file:///file1.txt'], true)
  expect(result).toEqual(decorations)
  expect(invocations).toEqual([
    ['SourceControl.getEnabledProviderIds', 'file', '/root'],
    ['SourceControl.getFileDecorations', 'git', ['file:///file1.txt']],
  ])
})

test('getFileDecorations - uses first provider ID when multiple are available', async () => {
  const decorations: FileDecoration[] = [{ uri: 'file:///file1.txt', type: 'modified' }]
  const invocations: any[] = []
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: any[]) => {
      invocations.push([method, ...args])
      if (method === 'SourceControl.getEnabledProviderIds') {
        return ['git', 'svn', 'hg']
      }
      if (method === 'SourceControl.getFileDecorations') {
        return decorations
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  SourceControlWorker.set(mockRpc)

  const { getFileDecorations } = await import('../src/parts/GetFileDecorations/GetFileDecorations.ts')
  const result = await getFileDecorations('file', '/root', ['/file1.txt'], true)
  expect(result).toEqual(decorations)
  expect(invocations).toEqual([
    ['SourceControl.getEnabledProviderIds', 'file', '/root'],
    ['SourceControl.getFileDecorations', 'git', ['file:///file1.txt']],
  ])
})

test('getFileDecorations - returns empty array when getEnabledProviderIds throws', async () => {
  const invocations: any[] = []
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: any[]) => {
      invocations.push([method, ...args])
      if (method === 'SourceControl.getEnabledProviderIds') {
        throw new Error('Provider error')
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  SourceControlWorker.set(mockRpc)

  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

  const { getFileDecorations } = await import('../src/parts/GetFileDecorations/GetFileDecorations.ts')
  const result = await getFileDecorations('file', '/root', ['/file1.txt'], true)
  expect(result).toEqual([])
  expect(invocations).toEqual([['SourceControl.getEnabledProviderIds', 'file', '/root']])
  expect(consoleErrorSpy).toHaveBeenCalled()

  consoleErrorSpy.mockRestore()
})

test('getFileDecorations - returns empty array when getFileDecorations throws', async () => {
  const invocations: any[] = []
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: any[]) => {
      invocations.push([method, ...args])
      if (method === 'SourceControl.getEnabledProviderIds') {
        return ['git']
      }
      if (method === 'SourceControl.getFileDecorations') {
        throw new Error('Decorations error')
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  SourceControlWorker.set(mockRpc)

  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

  const { getFileDecorations } = await import('../src/parts/GetFileDecorations/GetFileDecorations.ts')
  const result = await getFileDecorations('file', '/root', ['/file1.txt'], true)
  expect(result).toEqual([])
  expect(invocations).toEqual([
    ['SourceControl.getEnabledProviderIds', 'file', '/root'],
    ['SourceControl.getFileDecorations', 'git', ['file:///file1.txt']],
  ])
  expect(consoleErrorSpy).toHaveBeenCalled()

  consoleErrorSpy.mockRestore()
})

test('getFileDecorations - handles empty URIs array', async () => {
  const invocations: any[] = []
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: any[]) => {
      invocations.push([method, ...args])
      if (method === 'SourceControl.getEnabledProviderIds') {
        return ['git']
      }
      if (method === 'SourceControl.getFileDecorations') {
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  SourceControlWorker.set(mockRpc)

  const { getFileDecorations } = await import('../src/parts/GetFileDecorations/GetFileDecorations.ts')
  const result = await getFileDecorations('file', '/root', [], true)
  expect(result).toEqual([])
  expect(invocations).toEqual([
    ['SourceControl.getEnabledProviderIds', 'file', '/root'],
    ['SourceControl.getFileDecorations', 'git', []],
  ])
})
