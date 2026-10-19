import { chromium, expect } from '@playwright/test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { fileURLToPath } from 'node:url'

const listeningPattern = /listening on (http:\/\/\S+)/

const root = fileURLToPath(new URL('../../../', import.meta.url))
const server = spawn(process.execPath, ['packages/server/src/server.js', '--test-path=packages/e2e', '--only-extension=.'], {
  cwd: root,
  env: { ...process.env, HOST: '127.0.0.1', PORT: '0' },
  stdio: ['ignore', 'pipe', 'inherit'],
})
let browser
try {
  const url = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Server did not start')), 30_000)
    server.once('exit', (code) => {
      clearTimeout(timer)
      reject(new Error(`Server exited: ${code}`))
    })
    server.stdout.on('data', (data) => {
      const match = String(data).match(listeningPattern)
      if (match) {
        clearTimeout(timer)
        resolve(match[1])
      }
    })
  })
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 577 } })
  await page.goto(`${url}/tests/viewlet.explorer-scrollbar-reverses-at-bottom.html`)
  const first = page.locator('.Explorer .TreeItem[aria-label="file-000.txt"]')
  const last = page.locator('.Explorer .TreeItem[aria-label="file-099.txt"]')
  const track = page.locator('.Explorer .ScrollBar')
  const thumb = page.locator('.Explorer .ScrollBarThumb')
  await expect(first).toBeVisible({ timeout: 30_000 })
  await expect(thumb).toBeVisible()
  await expect(page.locator('#TestOverlay')).toHaveAttribute('data-state', 'pass')
  const original = await track.elementHandle()
  await original.evaluate((element) => {
    element.addEventListener('pointerdown', (event) => {
      element.dataset.pointerId = String(event.pointerId)
      element.captureTarget = event.target
    })
  })
  const bounds = await track.boundingBox()
  assert.ok(bounds)
  for (let cycle = 0; cycle < 3; cycle++) {
    const start = await thumb.boundingBox()
    assert.ok(start)
    const x = start.x + start.width / 2
    await page.mouse.move(x, start.y + start.height / 2)
    await page.mouse.down()
    for (let crossing = 0; crossing < 2; crossing++) {
      await page.mouse.move(x, bounds.y + bounds.height + 20)
      await expect(last).toBeVisible()
      assert.equal(await original.evaluate((element) => element.isConnected), true, 'drag must preserve the scrollbar DOM element')
      assert.equal(await original.evaluate((element) => element.captureTarget.hasPointerCapture(Number(element.dataset.pointerId))), true)
      const end = await thumb.boundingBox()
      assert.ok(
        end && end.y >= bounds.y && end.y + end.height <= bounds.y + bounds.height + 1,
        `thumb must stay within its track: ${JSON.stringify({ bounds, end })}`,
      )
      await page.mouse.move(x, bounds.y)
      await expect(first).toBeVisible()
      assert.equal(await original.evaluate((element) => element.captureTarget.hasPointerCapture(Number(element.dataset.pointerId))), true)
    }
    await page.mouse.up()
    await expect.poll(() => original.evaluate((element) => element.captureTarget.hasPointerCapture(Number(element.dataset.pointerId)))).toBe(false)
  }
  console.log('PASS scrollbar held-pointer reversal, repeated boundary crossings, release and re-grab')
} finally {
  await browser?.close()
  const exited = once(server, 'exit')
  server.kill()
  await exited
}
