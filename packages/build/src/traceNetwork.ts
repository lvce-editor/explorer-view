import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const target = join(dirname(require.resolve('@lvce-editor/test-with-playwright-worker/package.json')), 'dist', 'workerMain.js')
const source = await readFile(target, 'utf8')
const before = '  const browserInstance = await launcher.launch({\n    headless\n  });'
if (source.split(before).length !== 2) throw new Error('Expected one browser launch target')
const after = `  const browserInstance = await launcher.launch({
    headless,
    args: browser === 'chromium' ? ['--log-net-log=' + join(process.cwd(), 'e2e-artifacts', 'netlog.json'), '--net-log-capture-mode=Default'] : []
  });`
await writeFile(target, source.replace(before, after))
console.log('Enabled browser network capture:', target)
