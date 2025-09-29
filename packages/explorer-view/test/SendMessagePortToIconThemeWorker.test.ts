import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { sendMessagePortToIconThemeWorker } from '../src/parts/SendMessagePortToIconThemeWorker/SendMessagePortToIconThemeWorker.ts'

test('sendMessagePortToIconThemeWorker calls RendererWorker.sendMessagePortToIconThemeWorker with correct parameters', async () => {
  const { port1 } = new MessageChannel()
  const mockRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToIconThemeWorker'() {
      return undefined
    },
    'IconTheme.handleMessagePort'() {
      return undefined
    },
  })

  await sendMessagePortToIconThemeWorker(port1)

  expect(mockRpc.invocations).toEqual([
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToIconThemeWorker', port1, 'IconTheme.handleMessagePort', 0],
  ])
})

test('sendMessagePortToIconThemeWorker handles different port types', async () => {
  const { port1: port1a } = new MessageChannel()
  const { port1: port2a } = new MessageChannel()

  const mockRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToIconThemeWorker'() {
      return undefined
    },
    'IconTheme.handleMessagePort'() {
      return undefined
    },
  })

  await sendMessagePortToIconThemeWorker(port1a)
  await sendMessagePortToIconThemeWorker(port2a)

  expect(mockRpc.invocations).toEqual([
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToIconThemeWorker', port1a, 'IconTheme.handleMessagePort', 0],
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToIconThemeWorker', port2a, 'IconTheme.handleMessagePort', 0],
  ])
})

test('sendMessagePortToIconThemeWorker propagates errors from RendererWorker', async () => {
  const { port1 } = new MessageChannel()

  const mockRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToIconThemeWorker'() {
      throw new Error('RPC call failed')
    },
    'IconTheme.handleMessagePort'() {
      return undefined
    },
  })

  await expect(sendMessagePortToIconThemeWorker(port1)).rejects.toThrow('RPC call failed')
  expect(mockRpc.invocations).toEqual([
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToIconThemeWorker', port1, 'IconTheme.handleMessagePort', 0],
  ])
})

test('sendMessagePortToIconThemeWorker returns void when successful', async () => {
  const { port1 } = new MessageChannel()

  RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToIconThemeWorker'() {
      return undefined
    },
    'IconTheme.handleMessagePort'() {
      return undefined
    },
  })

  const result = await sendMessagePortToIconThemeWorker(port1)
  expect(result).toBeUndefined()
})
