import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-rename-empty-folder-collision-preserves-both'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/destination`)
  await FileSystem.mkdir(`${tmpDir}/source`)
  await Workspace.setPath(tmpDir)

  await Explorer.focusIndex(1)
  await Explorer.renameDirent()
  await Explorer.updateEditingValue('destination')
  await Explorer.acceptEdit()

  const input = Locator('.Explorer input')
  const errorMessage = Locator('.ExplorerErrorMessage')
  await expect(input).toBeVisible()
  await expect(input).toHaveClass('InputValidationError')
  await expect(errorMessage).toHaveText('A file or folder **destination** already exists at this location. Please choose a different name.')

  const entries = await FileSystem.readDir(tmpDir)
  const names = entries.map((entry) => entry.name)
  if (names.length !== 2 || !names.includes('destination') || !names.includes('source')) {
    throw new Error(`Expected both empty folders to be preserved, got ${JSON.stringify(names)}`)
  }
}
