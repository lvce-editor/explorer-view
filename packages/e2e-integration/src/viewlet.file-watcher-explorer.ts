import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.file-watcher-explorer'

// prepare.mjs fills in the collector host platform before staging this scenario.
const hostPlatform: string = '__HOST_PLATFORM__'

export const test: Test = async ({ Command, expect, Locator, Main }) => {
  const marker = `lvce-file-watcher-e2e-${Date.now()}`
  await Main.openUri('file-watcher-explorer:///')

  const explorer = Locator('.FileWatcherExplorer')
  await expect(explorer).toBeVisible()
  if (hostPlatform === '__HOST_PLATFORM__') throw new Error('Host platform must be configured by prepare.mjs')
  if (hostPlatform !== 'linux') {
    await expect(Locator('.FileWatcherExplorerMessage')).toHaveText('File Watcher Explorer is currently only supported on Linux.')
    return
  }

  try {
    await Command.execute('FileWatcherExplorer.createE2eFixtureWatcher', marker)
    const fixtureRow = Locator(`.FileWatcherExplorerRow[title*="${marker}"]`)
    await expect(fixtureRow).toBeVisible()
    await expect(fixtureRow.locator('.FileWatcherExplorerWatcherCountCell')).toHaveText('1')
  } finally {
    await Command.execute('FileWatcherExplorer.disposeE2eFixtureWatcher', marker)
  }
}
