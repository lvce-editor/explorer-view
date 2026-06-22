import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-restore-expanded-folders-after-reload'

export const skip = 1

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()
  const savedState = await Command.execute('Explorer.saveState')

  // act
  await Workspace.setPath('')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.restoreState', savedState)

  // assert
  const folder = Locator('.TreeItem[aria-label="folder"]')
  const file = Locator('.TreeItem[aria-label="file.txt"]')
  await expect(folder).toHaveAttribute('aria-expanded', 'true')
  await expect(file).toBeVisible()
}
