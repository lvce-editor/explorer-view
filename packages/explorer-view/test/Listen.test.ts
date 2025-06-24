import { test } from '@jest/globals'
import { listen } from '../src/parts/Listen/Listen.ts'

interface TestGlobalThis {
  onmessage: ((this: DedicatedWorkerGlobalScope, ev: MessageEvent) => any) | null
  WorkerGlobalScope: any
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => void
}

declare const globalThis: TestGlobalThis

// Reset globals
globalThis.onmessage = null
// @ts-ignore
globalThis.postMessage = (): void => {}
globalThis.WorkerGlobalScope = {}

test('listen', async () => {
  let onMessageListener: ((event: MessageEvent) => void) | undefined

  // Set up the onmessage handler
  globalThis.onmessage = (event: MessageEvent): void => {
    if (onMessageListener) {
      onMessageListener(event)
    }
  }

  // Mock addEventListener to capture the listener
  globalThis.addEventListener = (type: string, listener: EventListenerOrEventListenerObject): void => {
    if (type === 'message') {
      onMessageListener = listener as (event: MessageEvent) => void
    }
  }

  // Start listening
  const listenPromise = listen()

  // Simulate receiving a message with a MessagePort
  const { port1, port2 } = new MessageChannel()

  // Send the message with the port
  const messageEvent = new MessageEvent('message', {
    data: {
      jsonrpc: '2.0',
      method: 'initialize',
      params: ['message-port', port2],
    },
    ports: [port2],
  })

  if (onMessageListener) {
    onMessageListener(messageEvent)
  }

  await listenPromise

  port1.close()
  port2.close()
})
