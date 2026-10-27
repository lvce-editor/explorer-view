import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rename, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const rendererWorkerPattern = /\/renderer-worker\/(?:src|dist)\/rendererWorkerMain/

const eventually = async (read, expected) => {
  const deadline = Date.now() + 15_000
  let actual
  do {
    actual = await read()
    if (actual === expected) return
    await new Promise((resolve) => setTimeout(resolve, 30))
  } while (Date.now() < deadline)
  assert.equal(actual, expected, `Gitignore styling assertion: ${read.toString()}`)
}

export const test = async ({ page }) => {
  const root = await mkdtemp(join(tmpdir(), 'lvce-gitignore-live-'))
  const uri = pathToFileURL(root).href
  const titleRoot = uri.slice('file://'.length)
  const worker = page.workers().find((entry) => rendererWorkerPattern.test(entry.url()))
  assert.ok(worker, 'Renderer worker must be running')
  await worker.evaluate(async () => {
    const { execute } = await import('/packages/renderer-worker/src/parts/Command/Command.js')
    globalThis.gitIgnoreCommand = execute
  })
  const command = (id, ...args) => worker.evaluate(([id, args]) => globalThis.gitIgnoreCommand(id, ...args), [id, args])
  const ignored = (path) => page.locator(`.TreeItem[title="${titleRoot}/${path}"] .Label`).evaluate((node) => node.classList.contains('LabelCut'))
  try {
    await mkdir(join(root, 'sub'))
    await writeFile(join(root, 'debug.log'), '')
    await writeFile(join(root, 'plain.txt'), '')
    await writeFile(join(root, 'sub', 'child.tmp'), '')
    await command('Workspace.setUri', uri)
    await command('SideBar.openViewlet', 'Explorer')
    await command('Explorer.expandRecursively')
    await page.locator(`.TreeItem[title="${titleRoot}/sub/child.tmp"]`).waitFor()
    await eventually(() => ignored('debug.log'), false)

    // Real disk writes bypass the editor's workspace-refresh notification.
    await writeFile(join(root, '.gitignore'), '*.log')
    await eventually(() => ignored('debug.log'), true)
    assert.equal(await ignored('plain.txt'), false)
    await writeFile(join(root, '.gitignore'), '*.txt')
    await eventually(() => ignored('debug.log'), false)
    await eventually(() => ignored('plain.txt'), true)
    await writeFile(join(root, 'sub', '.gitignore'), '*.tmp')
    await eventually(() => ignored('sub/child.tmp'), true)
    assert.equal(await ignored('debug.log'), false)

    for (const patterns of ['*.log', '*.txt', '*.log', '*.txt']) {
      await writeFile(join(root, '.gitignore'), patterns)
    }
    await eventually(() => ignored('debug.log'), false)
    await eventually(() => ignored('plain.txt'), true)

    // Atomic saves replace the watched file; the parent subscription must survive.
    await writeFile(join(root, 'sub', '.gitignore.new'), '!*.tmp')
    await rename(join(root, 'sub', '.gitignore.new'), join(root, 'sub', '.gitignore'))
    await eventually(() => ignored('sub/child.tmp'), false)
    await rm(join(root, '.gitignore'))
    await eventually(() => ignored('plain.txt'), false)

    // A regular editor save uses the existing application refresh route.
    await writeFile(join(root, '.gitignore'), '')
    await command('Main.openUri', `${uri}/.gitignore`)
    await command('Editor.setText', '*.log')
    await command('Main.save')
    await eventually(() => ignored('debug.log'), true)
    await command('Editor.setText', '')
    await command('Main.save')
    await eventually(() => ignored('debug.log'), false)

    console.log(
      'PASS live gitignore DOM assertions: external creation, edits, nested rules, rapid writes, atomic replacement, deletion, editor saves',
    )
    await command('Workspace.setUri', 'memfs:///')
  } finally {
    await command('Workspace.setUri', 'memfs:///').catch(() => {})
    await rm(root, { recursive: true, force: true })
  }
}
