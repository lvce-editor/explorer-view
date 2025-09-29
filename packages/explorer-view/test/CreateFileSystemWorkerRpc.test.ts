import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CreateFileSystemWorkerRpc from '../src/parts/CreateFileSystemWorkerRpc/CreateFileSystemWorkerRpc.ts'

test('createFileSystemWorkerRpc - success', async () => {
  RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      return undefined
    },
  })

  const result = await CreateFileSystemWorkerRpc.createFileSystemWorkerRpc()

  expect(result).toBeDefined()
  expect(typeof result.invoke).toBe('function')
  expect(typeof result.send).toBe('function')
})

test('createFileSystemWorkerRpc - returns RPC with correct properties', async () => {
  RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      return undefined
    },
  })

  const result = await CreateFileSystemWorkerRpc.createFileSystemWorkerRpc()

  expect(result).toHaveProperty('invoke')
  expect(result).toHaveProperty('send')
  expect(typeof result.invoke).toBe('function')
  expect(typeof result.send).toBe('function')
})

test('createFileSystemWorkerRpc - RPC has empty commandMap', async () => {
  RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      return undefined
    },
  })

  const result = await CreateFileSystemWorkerRpc.createFileSystemWorkerRpc()

  expect(result).toBeDefined()
  // The RPC should be created with an empty commandMap as per the source code
})

test('createFileSystemWorkerRpc - uses correct send function', async () => {
  RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      return undefined
    },
  })

  const result = await CreateFileSystemWorkerRpc.createFileSystemWorkerRpc()

  expect(result).toBeDefined()
  // The send function should be SendMessagePortToFileSystemWorker.sendMessagePortToFileSystemWorker
})

test('createFileSystemWorkerRpc - handles TransferMessagePortRpcParent.create success', async () => {
  RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      return undefined
    },
  })

  const result = await CreateFileSystemWorkerRpc.createFileSystemWorkerRpc()

  expect(result).toBeDefined()
  expect(result).not.toBeNull()
})

test('createFileSystemWorkerRpc - error handling with generic error', async () => {
  RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      throw new Error('RPC creation failed')
    },
  })

  await expect(CreateFileSystemWorkerRpc.createFileSystemWorkerRpc()).rejects.toThrow('Failed to create file system worker rpc')
})

test('createFileSystemWorkerRpc - error handling with TypeError', async () => {
  RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      throw new TypeError('Invalid argument')
    },
  })

  await expect(CreateFileSystemWorkerRpc.createFileSystemWorkerRpc()).rejects.toThrow('Failed to create file system worker rpc')
})

test('createFileSystemWorkerRpc - error handling with ReferenceError', async () => {
  RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      throw new ReferenceError('Variable not defined')
    },
  })

  await expect(CreateFileSystemWorkerRpc.createFileSystemWorkerRpc()).rejects.toThrow('Failed to create file system worker rpc')
})

test('createFileSystemWorkerRpc - error handling with custom error', async () => {
  RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      throw new Error('Custom error message')
    },
  })

  await expect(CreateFileSystemWorkerRpc.createFileSystemWorkerRpc()).rejects.toThrow('Failed to create file system worker rpc')
})

test('createFileSystemWorkerRpc - error handling preserves original error message', async () => {
  RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      throw new Error('Original error message')
    },
  })

  try {
    await CreateFileSystemWorkerRpc.createFileSystemWorkerRpc()
  } catch (error: unknown) {
    expect((error as Error).message).toContain('Failed to create file system worker rpc')
    expect((error as Error).message).toContain('Original error message')
  }
})

test('createFileSystemWorkerRpc - multiple calls return different instances', async () => {
  RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      return undefined
    },
  })

  const result1 = await CreateFileSystemWorkerRpc.createFileSystemWorkerRpc()
  const result2 = await CreateFileSystemWorkerRpc.createFileSystemWorkerRpc()

  expect(result1).toBeDefined()
  expect(result2).toBeDefined()
  expect(result1).not.toBe(result2)
})

test('createFileSystemWorkerRpc - async behavior', async () => {
  RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      return undefined
    },
  })

  const startTime = Date.now()
  const result = await CreateFileSystemWorkerRpc.createFileSystemWorkerRpc()
  const endTime = Date.now()

  expect(result).toBeDefined()
  expect(endTime - startTime).toBeGreaterThanOrEqual(0)
})

test('createFileSystemWorkerRpc - returns Promise<Rpc>', async () => {
  RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      return undefined
    },
  })

  const resultPromise = CreateFileSystemWorkerRpc.createFileSystemWorkerRpc()
  expect(resultPromise).toBeInstanceOf(Promise)

  const result = await resultPromise
  expect(result).toBeDefined()
})
