import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const bundle = join(dirname(require.resolve('@lvce-editor/test-with-playwright-worker/package.json')), 'dist/workerMain.js')
let source = readFileSync(bundle, 'utf8')
const patches = [
  [
    'const startWorkerJavascriptCoverage = async (page, targetScript) => {',
    "const startWorkerJavascriptCoverage = async (page, targetScript) => {\n  const diagnostic = (event, detail = {}) => console.info('[coverage-cdp]', JSON.stringify({time: performance.now(), event, ...detail}));",
  ],
  [
    'const response = JSON.parse(message);\n    if (response.id === undefined)',
    "const response = JSON.parse(message);\n    diagnostic('response', {id: response.id, error: response.error});\n    if (response.id === undefined)",
  ],
  ['const id = ++commandId;\n    const command', "const id = ++commandId;\n    diagnostic('send', {id, sessionId, method});\n    const command"],
  ['const onDetached = ({\n    sessionId\n  }) => {', "const onDetached = ({\n    sessionId\n  }) => {\n    diagnostic('detached', {sessionId});"],
  [
    'stopped = true;\n      session.off',
    "stopped = true;\n      diagnostic('stop', {tasks: tasks.size, snapshots: pendingEntries.size, pending: [...pendingCommands.keys()]});\n      session.on('Target.detachedFromTarget', ({sessionId}) => diagnostic('stop-detached', {sessionId}));\n      session.off",
  ],
  [
    'autoAttach: false,\n          flatten: false,\n          waitForDebuggerOnStart: false\n        });',
    "autoAttach: false,\n          flatten: false,\n          waitForDebuggerOnStart: false\n        });\n        diagnostic('autoattach-disabled', {tasks: tasks.size, snapshots: pendingEntries.size, pending: [...pendingCommands.keys()]});",
  ],
]
for (const [before, after] of patches) {
  if (source.split(before).length !== 2) {
    throw new Error(`Expected one coverage diagnostic target: ${before}`)
  }
  source = source.replace(before, after)
}
writeFileSync(bundle, source)
console.info(`Patched coverage CDP diagnostics: ${bundle}`)
