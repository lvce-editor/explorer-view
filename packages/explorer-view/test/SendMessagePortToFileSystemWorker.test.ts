import { test, expect, jest } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { sendMessagePortToFileSystemWorker } from '../src/parts/SendMessagePortToFileSystemWorker/SendMessagePortToFileSystemWorker.ts'

test('sendMessagePortToFileSystemWorker calls RendererWorker.sendMessagePortToFileSystemWorker with correct parameters', async () => {
  const mockPort = { postMessage: jest.fn(), close: jest.fn() }
  const mockRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      return undefined
    },
    'FileSystem.handleMessagePort'() {
      return undefined
    },
  })

  await sendMessagePortToFileSystemWorker(mockPort)

  expect(mockRpc.invocations).toEqual([
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker', mockPort]
  ])
})

test('sendMessagePortToFileSystemWorker handles different port types', async () => {
  const mockPort1 = { postMessage: jest.fn(), close: jest.fn() }
  const mockPort2 = { send: jest.fn(), terminate: jest.fn() }
  
  const mockRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      return undefined
    },
    'FileSystem.handleMessagePort'() {
      return undefined
    },
  })

  await sendMessagePortToFileSystemWorker(mockPort1)
  await sendMessagePortToFileSystemWorker(mockPort2)

  expect(mockRpc.invocations).toEqual([
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker', mockPort1],
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker', mockPort2]
  ])
})

test('sendMessagePortToFileSystemWorker propagates errors from RendererWorker', async () => {
  const mockPort = { postMessage: jest.fn(), close: jest.fn() }
  const error = new Error('RPC call failed')
  
  const mockRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      throw error
    },
    'FileSystem.handleMessagePort'() {
      return undefined
    },
  })

  await expect(sendMessagePortToFileSystemWorker(mockPort)).rejects.toThrow('RPC call failed')
  expect(mockRpc.invocations).toEqual([
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker', mockPort]
  ])
})

test('sendMessagePortToFileSystemWorker returns void when successful', async () => {
  const mockPort = { postMessage: jest.fn(), close: jest.fn() }
  
  RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      return undefined
    },
    'FileSystem.handleMessagePort'() {
      return undefined
    },
  })

  const result = await sendMessagePortToFileSystemWorker(mockPort)
  expect(result).toBeUndefined()
})