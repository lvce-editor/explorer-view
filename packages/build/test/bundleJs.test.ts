import assert from 'node:assert/strict'
import { access, mkdir, readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { test } from 'node:test'
import { bundleJs } from '../src/bundleJs.ts'
import { root } from '../src/root.ts'

test('does not generate a production source map', async () => {
  const dist = join(root, '.tmp', 'dist', 'dist')
  const bundlePath = join(dist, 'explorerViewWorkerMain.js')
  const sourcemapPath = `${bundlePath}.map`

  await mkdir(dist, { recursive: true })
  await rm(sourcemapPath, { force: true })
  await bundleJs()

  const bundle = await readFile(bundlePath, 'utf8')
  await assert.rejects(access(sourcemapPath))
  assert.doesNotMatch(bundle, /sourceMappingURL/)
})
