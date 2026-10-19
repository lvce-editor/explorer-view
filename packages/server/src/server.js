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
  subscribe('http.server.request.start', ({ request }) => record('request', request))
  subscribe('http.server.response.finish', ({ request, response }) => record('response', request, response))
}

const workerPath = fileURLToPath(new URL('../../../.tmp/dist', import.meta.url))
process.argv.push(`--link=${workerPath}`)

await import('@lvce-editor/server/bin/server.js')
