import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const serverTarget = join(dirname(require.resolve('@lvce-editor/server/package.json')), 'src', 'server.js')
let serverSource = await readFile(serverTarget, 'utf8')
const startNeedle = '  const sharedProcess = await getOrCreateSharedProcess()\n  sharedProcess.send('
const endNeedle = '      keepOpen: false,\n    },\n  )\n}'
if (serverSource.split(startNeedle).length !== 2 || serverSource.split(endNeedle).length !== 2) throw new Error('Expected one socket transfer target')
serverSource = serverSource.replace(startNeedle, `  const sharedProcess = await getOrCreateSharedProcess()
  const transferredHandle = socket._handle
  sharedProcess.send(`)
serverSource = serverSource.replace(endNeedle, `      keepOpen: false,
    },
  )
  if (transferredHandle && socket._handle === null) {
    const originalRead = transferredHandle.onread
    transferredHandle.onread = function (buffer) {
      if (buffer?.byteLength) console.error('[socket-transfer-discard]', JSON.stringify({time:Date.now(), bytes:buffer.byteLength, url:request.url}))
      return originalRead.apply(this, arguments)
    }
  }
}`)
await writeFile(serverTarget, serverSource)
console.log('Instrumented socket transfer reads:', serverTarget)
