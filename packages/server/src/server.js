import { subscribe } from 'node:diagnostics_channel'
import { fileURLToPath } from 'node:url'

if (process.env.LVCE_E2E_HTTP_TRACE === '1') {
  let sequence = 0
  const record = (type, request, response) => {
    const path = new URL(request.url || '/', 'http://127.0.0.1').pathname
    if (!path.startsWith('/tests/') || !path.endsWith('.html')) {
      return
    }
    console.info('[e2e-http]', JSON.stringify({ sequence: ++sequence, time: new Date().toISOString(), type, path, status: response?.statusCode }))
  }
  subscribe('http.server.request.start', (message) => {
    const { request } = /** @type {{ request: import('node:http').IncomingMessage }} */ (message)
    record('request', request)
  })
  subscribe('http.server.response.finish', (message) => {
    const { request, response } = /** @type {{ request: import('node:http').IncomingMessage, response: import('node:http').ServerResponse }} */ (
      message
    )
    record('response', request, response)
  })
}

const workerPath = fileURLToPath(new URL('../../../.tmp/dist', import.meta.url))
process.argv.push(`--link=${workerPath}`)

await import('@lvce-editor/server/bin/server.js')
