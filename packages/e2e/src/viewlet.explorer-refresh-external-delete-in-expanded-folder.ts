import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-refresh-external-delete-in-expanded-folder'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.setFiles([
    { content: 'deleted', uri: `${tmpDir}/folder/deleted.txt` },
    { content: 'kept', uri: `${tmpDir}/folder/kept.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()
  const folder = Locator('.TreeItem[aria-label="folder"]')
  const deleted = Locator('.TreeItem[aria-label="deleted.txt"]')
  const kept = Locator('.TreeItem[aria-label="kept.txt"]')
  await expect(deleted).toBeVisible()
  await expect(kept).toBeVisible()

  // act
  await FileSystem.remove(`${tmpDir}/folder/deleted.txt`)
  await Explorer.refresh()

  // assert
  await expect(folder).toHaveAttribute('aria-expanded', 'true')
  await expect(deleted).toBeHidden()
  await expect(kept).toBeVisible()
}
