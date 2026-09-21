import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const packagePath = require.resolve('@lvce-editor/test-with-playwright-worker/package.json')
const target = join(dirname(packagePath), 'dist', 'workerMain.js')
let source = await readFile(target, 'utf8')
const replacements = [
  ['  try {\n    if (traceRendererWorker) {', `  const socketEvents = [];
  page.on('websocket', socket => {
    const connection = socketEvents.length;
    const record = (event, details = {}) => socketEvents.push({time:Date.now(), connection, event, ...details});
    record('created', {url:socket.url(), page:page.url()});
    for (const type of ['framesent', 'framereceived']) {
      let first = true;
      socket.on(type, frame => {
        if (!first) return;
        first = false;
        let message;
        try {message = JSON.parse(String(frame.payload));} catch {}
        record(type, {method:message?.method, id:message?.id, error:message?.error, hasResult:message && Object.hasOwn(message, 'result')});
      });
    }
    socket.on('socketerror', error => record('error', {error:String(error)}));
    socket.on('close', () => record('close'));
  });
  try {
    if (traceRendererWorker) {`],
  ['  } finally {\n    await tearDownTests({', `  } finally {
    await writeFile(join(cwd, 'e2e-artifacts', 'browser-websockets-' + browser + '.json'), JSON.stringify(socketEvents));
    await tearDownTests({`],
]
for (const [before, after] of replacements) {
  if (source.split(before).length !== 2) throw new Error('Expected one browser capture target: ' + before)
  source = source.replace(before, after)
}
await writeFile(target, source)
console.log('Instrumented browser WebSockets:', target)

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
