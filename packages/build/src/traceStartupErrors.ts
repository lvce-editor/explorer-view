import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const target = join(dirname(require.resolve('@lvce-editor/test-with-playwright-worker/package.json')), 'dist', 'workerMain.js')
let source = await readFile(target, 'utf8')
const replacements = [
  [
    '  const onResult = async result => {\n    await rpc.invoke(HandleResult, result);',
    `  const startupEvents = [];
  const onResult = async result => {
    if (result.status === Fail$1 || result.name.includes('toolbar-new-file-button')) {
      await mkdir(join(cwd, 'e2e-artifacts'), {recursive:true});
      await writeFile(join(cwd, 'e2e-artifacts', basename(result.name) + '.startup.json'), JSON.stringify(startupEvents));
    }
    startupEvents.length = 0;
    await rpc.invoke(HandleResult, result);`,
  ],
  [
    '  try {\n    if (traceRendererWorker) {',
    `  const recordStartup = (kind, details) => startupEvents.push({time:Date.now(), kind, ...details});
  page.on('console', message => {
    if (message.type() === 'error' || message.type() === 'warning') recordStartup('console', {text:message.text()});
  });
  page.on('pageerror', error => recordStartup('pageerror', {text:String(error)}));
  page.on('requestfailed', request => recordStartup('requestfailed', {url:request.url(), error:request.failure()}));
  page.on('websocket', socket => {
    recordStartup('websocket', {url:socket.url()});
    socket.on('socketerror', error => recordStartup('websocket-error', {url:socket.url(), error:String(error)}));
    socket.on('close', () => recordStartup('websocket-close', {url:socket.url()}));
  });
  try {
    if (traceRendererWorker) {`,
  ],
]
for (const [before, after] of replacements) {
  if (source.split(before).length !== 2) throw new Error('Expected one startup capture target: ' + before)
  source = source.replace(before, after)
}
await writeFile(target, source)
console.log('Instrumented startup errors:', target)
