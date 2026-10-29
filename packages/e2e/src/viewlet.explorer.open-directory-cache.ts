import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer.open-directory-cache'

export const test: Test = async ({ expect, Explorer, Extension, FileSystem, Locator, Workspace }) => {
  await Extension.addWebExtension(import.meta.resolve('../fixtures/sample.directory-cache'))
  const root = 'extension-host://directory-cache://host/workspace'
  const statsUri = 'extension-host://directory-cache://host/stats'
  await Workspace.setUri(root)
  await Explorer.focusIndex(0)
  await Explorer.handleArrowRight()
  const first = Locator('.TreeItem[aria-label="first.txt"]')
  await expect(first).toBeVisible()
  const before = JSON.parse(await FileSystem.readFile(statsUri)) as { listings: number; validations: number }
  if (before.listings < 1 || before.validations < 1) {
    throw new Error('Directory cache regression did not exercise provider validation and listing')
  }

  await Explorer.handleArrowLeft()
  await expect(first).toBeHidden()
  await Explorer.handleArrowRight()
  await expect(first).toBeVisible()
  const after = JSON.parse(await FileSystem.readFile(statsUri)) as { listings: number; validations: number }
  if (after.listings !== before.listings || after.validations <= before.validations) {
    throw new Error(`Unchanged folder was transferred again: ${JSON.stringify({ after, before })}`)
  }

  // Recreate the workspace view while keeping the provider connection alive.
  const temporaryWorkspace = await FileSystem.getTmpDir()
  await Workspace.setUri(temporaryWorkspace)
  await Workspace.setUri(root)
  await Explorer.focusIndex(0)
  await Explorer.handleArrowRight()
  await expect(first).toBeVisible()
  const restored = JSON.parse(await FileSystem.readFile(statsUri)) as { listings: number }
  if (restored.listings !== before.listings) {
    throw new Error('Recreated explorer view did not reuse the persisted listing')
  }

  // A metadata change must make a collapsed folder reopen with current entries.
  await Explorer.handleArrowLeft()
  await FileSystem.writeFile(`${root}/folder/new.txt`, 'new')
  await Explorer.handleArrowRight()
  const created = Locator('.TreeItem[aria-label="new.txt"]')
  await expect(created).toBeVisible()

  await FileSystem.rename(`${root}/folder/new.txt`, `${root}/folder/renamed.txt`)
  await FileSystem.remove(`${root}/folder/first.txt`)
  await Explorer.refresh()
  await expect(created).toBeHidden()
  await expect(first).toBeHidden()
  const renamed = Locator('.TreeItem[aria-label="renamed.txt"]')
  await expect(renamed).toBeVisible()

  const preRefresh = JSON.parse(await FileSystem.readFile(statsUri)) as { listings: number }
  await Explorer.refresh()
  const postRefresh = JSON.parse(await FileSystem.readFile(statsUri)) as { listings: number }
  if (postRefresh.listings <= preRefresh.listings) {
    throw new Error('Explicit refresh incorrectly reused the cached listing')
  }
}
