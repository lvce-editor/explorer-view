import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { sendMessagePortToFileSystemWorker } from '../src/parts/SendMessagePortToFileSystemWorker/SendMessagePortToFileSystemWorker.ts'

test('sendMessagePortToFileSystemWorker calls RendererWorker.sendMessagePortToFileSystemWorker with correct parameters', async () => {
  const { port1 } = new MessageChannel()
  const mockRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      return undefined
    },
    'FileSystem.handleMessagePort'() {
      return undefined
    },
  })

  await sendMessagePortToFileSystemWorker(port1)

  expect(mockRpc.invocations).toEqual([
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker', port1, 'FileSystem.handleMessagePort', 0],
  ])
})

test('sendMessagePortToFileSystemWorker handles different port types', async () => {
  const { port1: port1a } = new MessageChannel()
  const { port1: port2a } = new MessageChannel()

  const mockRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      return undefined
    },
    'FileSystem.handleMessagePort'() {
      return undefined
    },
  })

  await sendMessagePortToFileSystemWorker(port1a)
  await sendMessagePortToFileSystemWorker(port2a)

  expect(mockRpc.invocations).toEqual([
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker', port1a, 'FileSystem.handleMessagePort', 0],
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker', port2a, 'FileSystem.handleMessagePort', 0],
  ])
})

test('sendMessagePortToFileSystemWorker propagates errors from RendererWorker', async () => {
  const { port1 } = new MessageChannel()

  const mockRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      throw new Error('RPC call failed')
    },
    'FileSystem.handleMessagePort'() {
      return undefined
    },
  })

  await expect(sendMessagePortToFileSystemWorker(port1)).rejects.toThrow('RPC call failed')
  expect(mockRpc.invocations).toEqual([
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker', port1, 'FileSystem.handleMessagePort', 0],
  ])
})

test('sendMessagePortToFileSystemWorker returns void when successful', async () => {
  const { port1 } = new MessageChannel()

  RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {
      return undefined
    },
    'FileSystem.handleMessagePort'() {
      return undefined
    },
  })

  const result = await sendMessagePortToFileSystemWorker(port1)
  expect(result).toBeUndefined()
})
