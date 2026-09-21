import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const target = require.resolve('@lvce-editor/web-socket-server')
const source = await readFile(target, 'utf8')
const needle = 'webSocketServer.handleUpgrade(request, socket, Buffer.alloc(0), resolve);'
const replacement = `webSocketServer.handleUpgrade(request, socket, Buffer.alloc(0), (webSocket) => {
  const originalEmit = webSocket.emit;
  let first = true;
  webSocket.emit = function(type, ...args) {
    if (type === 'message') {
      const listeners = this.listenerCount('message');
      if (first || listeners === 0) {
        let message;
        try { message = JSON.parse(String(args[0])); } catch {}
        console.error('[websocket-startup]', JSON.stringify({time:Date.now(), url:request.url, event: listeners === 0 ? 'unhandled-message' : 'first-message', method:message?.method, id:message?.id, listeners}));
      }
      first = false;
    }
    return originalEmit.call(this, type, ...args);
  };
  resolve(webSocket);
});`
if (source.split(needle).length !== 2) throw new Error('Expected exactly one WebSocket upgrade callback')
await writeFile(target, source.replace(needle, replacement))
console.log('Instrumented WebSocket startup:', target)
