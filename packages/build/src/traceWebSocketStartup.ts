import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const target = require.resolve('@lvce-editor/web-socket-server')
const source = await readFile(target, 'utf8')
const needle = 'webSocketServer.handleUpgrade(request, socket, Buffer.alloc(0), resolve);'
const replacement = `webSocketServer.handleUpgrade(request, socket, Buffer.alloc(0), (webSocket) => {
  const originalEmit = webSocket.emit;
  const originalSend = webSocket.send;
  const connection = wsStartup.length;
  let first = true;
  let firstId;
  wsStartup.push({time:Date.now(), connection, url:request.url, event:'upgraded'});
  webSocket.emit = function(type, ...args) {
    if (type === 'message') {
      const listeners = this.listenerCount('message');
      if (first || listeners === 0) {
        let message;
        try { message = JSON.parse(String(args[0])); } catch {}
        if (first) firstId = message?.id;
        wsStartup.push({time:Date.now(), connection, event: listeners === 0 ? 'unhandled-message' : 'first-message', method:message?.method, id:message?.id, listeners});
      }
      first = false;
    }
    if(type === 'close' || type === 'error') wsStartup.push({time:Date.now(), connection, event:type});
    return originalEmit.call(this, type, ...args);
  };
  webSocket.send = function(data, ...args) {
    let message;
    try { message = JSON.parse(String(data)); } catch {}
    if (message?.id === firstId) wsStartup.push({time:Date.now(), connection, event:'first-reply', id:message.id});
    return originalSend.call(this, data, ...args);
  };
  resolve(webSocket);
});`
if (source.split(needle).length !== 2) throw new Error('Expected exactly one WebSocket upgrade callback')
const capture = `import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
const wsStartup = [];
process.on('exit', () => {
  const directory = process.env.LVCE_WS_TRACE_DIR;
  if (!directory) return;
  mkdirSync(directory, {recursive:true});
  writeFileSync(join(directory, 'ws-startup-' + process.pid + '.json'), JSON.stringify(wsStartup));
});
`
await writeFile(target, capture + source.replace(needle, replacement))
console.log('Instrumented WebSocket startup:', target)
