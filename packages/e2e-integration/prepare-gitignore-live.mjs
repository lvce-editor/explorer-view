import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

assert.ok(process.argv[2], 'Pass a disposable application checkout')
const index = resolve(process.argv[2], 'static/index.html')
const original = await readFile(index, 'utf8')
const pattern = /(<script\b[^>]*\bid=["']Config["'][^>]*>)([\s\S]*?)(<\/script>)/i
const match = original.match(pattern)
assert.ok(match, 'Application runtime configuration missing')
const config = JSON.parse(match[2])
config.platform = 'remote'
await writeFile(
  index,
  original.replace(pattern, (_match, start, _config, end) => `${start}${JSON.stringify(config)}${end}`),
)
