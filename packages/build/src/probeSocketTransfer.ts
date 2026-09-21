import { fork } from 'node:child_process'
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import WebSocket, { WebSocketServer } from 'ws'

const role = process.argv[2]
if (role === 'backend') {
  const server = new WebSocketServer({ noServer: true })
  process.on('message', (request: any, socket: any) => {
    socket.pause()
    server.handleUpgrade(request, socket, Buffer.alloc(0), (ws) => {
      ws.on('message', (data) => ws.send(data))
      socket.resume()
    })
  })
} else if (role === 'client') {
  let failed = 0
  for (let i = 0; i < 200; i++) {
    await new Promise<void>((resolve) => {
      const ws = new WebSocket(process.argv[3])
      const timer = setTimeout(() => {
        failed++
        ws.terminate()
        resolve()
      }, 1000)
      ws.on('error', () => {})
      ws.on('open', () => ws.send(JSON.stringify({ id: i, method: 'Process.getArgv', params: [] })))
      ws.on('message', () => {
        clearTimeout(timer)
        ws.close()
        resolve()
      })
    })
  }
  process.send?.({ failed })
  process.disconnect?.()
} else {
  for (const pause of [false, true]) {
    const backend = fork(fileURLToPath(import.meta.url), ['backend'])
    const server = createServer()
    const blocker = new Int32Array(new SharedArrayBuffer(4))
    let discarded = 0
    let bytes = 0
    server.on('upgrade', (request, socket: any) => {
      if (pause) socket.pause()
      const handle = socket._handle
      backend.send({ headers: request.headers, method: request.method, url: request.url, httpVersionMajor: request.httpVersionMajor, httpVersionMinor: request.httpVersionMinor }, socket, { keepOpen: false })
      const original = handle.onread
      handle.onread = function (buffer: ArrayBuffer) {
        if (buffer?.byteLength) {
          discarded++
          bytes += buffer.byteLength
        }
        return original.apply(this, arguments)
      }
      // Keep the parent occupied while the other two processes exchange the first frame.
      Atomics.wait(blocker, 0, 0, 20)
    })
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
    const address: any = server.address()
    const client = fork(fileURLToPath(import.meta.url), ['client', `ws://127.0.0.1:${address.port}`])
    const result = await new Promise<any>((resolve) => client.once('message', resolve))
    console.log(JSON.stringify({ pause, ...result, discarded, bytes }))
    backend.kill()
    server.close()
  }
}
