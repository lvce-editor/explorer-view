import { expect, jest, test } from '@jest/globals'
import { createMockRpc, PlainMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererProcess as RendererProcessRegistry, RendererWorker } from '@lvce-editor/rpc-registry'
import { handleMessagePort } from '../src/parts/HandleMessagePort/HandleMessagePort.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

test('connects the view directly to the renderer process', async () => {
  let failActiveEditorLookup = false
  const activeEditorFocusScheduled = Promise.withResolvers<void>()
  const queueCommands = jest.fn((_uid: number, _commands: readonly unknown[]) => 31)
  const focusSelector = jest.fn(async (_uid: number, _selector: string) => {})
  const focusSelectorAfterRender = jest.fn(async (_uid: number, _selector: string) => {
    activeEditorFocusScheduled.resolve()
  })
  const { port1, port2 } = new MessageChannel()
  const rendererProcessRpc = await PlainMessagePortRpcParent.create({
    commandMap: {
      'Viewlet.focusSelector': focusSelector,
      'Viewlet.focusSelectorAfterRender': focusSelectorAfterRender,
      'Viewlet.queueCommands': queueCommands,
    },
    messagePort: port1,
  })
  const handleEvent = jest.fn(async (_uid: number, _value: string) => {})

  await handleMessagePort(port2, {
    'Explorer.handleEvent': handleEvent,
  })
  expect(RendererProcess.isConnected()).toBe(true)
  await expect(RendererProcess.invoke('Viewlet.queueCommands', 7, [['Viewlet.setDom2', 7, []]])).resolves.toBe(31)
  expect(queueCommands).toHaveBeenCalledWith(7, [['Viewlet.setDom2', 7, []]])

  const requestRender = jest.fn(async (_uid: number) => {})
  const fallbackFocused = Promise.withResolvers<void>()
  const focus = jest.fn(async () => {
    fallbackFocused.resolve()
  })
  RendererWorker.set(
    Object.assign(
      createMockRpc({
        commandMap: {
          'GetActiveEditor.getActiveEditorId'() {
            if (failActiveEditorLookup) {
              throw new Error('active editor not found')
            }
            return 42
          },
          'Main.focus': focus,
          'Viewlet.requestRender': requestRender,
        },
      }),
      { dispose: jest.fn() },
    ),
  )
  await rendererProcessRpc.invoke('Viewlet.executeViewletCommand', 7, 'handleEvent', 'hello')
  expect(handleEvent).toHaveBeenCalledWith(7, 'hello')
  expect(requestRender).toHaveBeenCalledWith(7)
  RendererProcess.requestPostRenderFocus(7)
  await rendererProcessRpc.invoke('Viewlet.executeViewletCommand', 7, 'handleEvent', 'world')
  await activeEditorFocusScheduled.promise
  expect(focusSelector).toHaveBeenCalledWith(42, '.EditorInput textarea')
  expect(focusSelectorAfterRender).toHaveBeenCalledWith(42, '.EditorInput textarea')
  expect(focus).not.toHaveBeenCalled()
  failActiveEditorLookup = true
  RendererProcess.requestPostRenderFocus(7)
  await rendererProcessRpc.invoke('Viewlet.executeViewletCommand', 7, 'handleEvent', 'fallback')
  await fallbackFocused.promise
  expect(focus).toHaveBeenCalledTimes(1)
  await expect(rendererProcessRpc.invoke('Viewlet.executeViewletCommand', 7, 'missing')).rejects.toThrow('Viewlet command not found: missing')

  await RendererProcessRegistry.dispose()
  await RendererWorker.dispose()
  await rendererProcessRpc.dispose()
})

test('keeps the renderer process rpc for a secondary direct connection', async () => {
  const queueCommands = jest.fn((_uid: number, _commands: readonly unknown[]) => 31)
  RendererProcessRegistry.set(
    Object.assign(
      createMockRpc({
        commandMap: { 'Viewlet.queueCommands': queueCommands },
      }),
      { dispose: jest.fn() },
    ),
  )
  const { port1, port2 } = new MessageChannel()

  await handleMessagePort(port2, {}, false)

  expect(RendererProcess.invoke('Viewlet.queueCommands', 7, [])).toBe(31)
  expect(queueCommands).toHaveBeenCalledWith(7, [])

  port1.close()
  port2.close()
  await RendererProcessRegistry.dispose()
})
