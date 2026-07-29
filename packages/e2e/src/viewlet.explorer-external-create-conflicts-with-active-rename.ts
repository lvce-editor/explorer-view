import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-external-create-conflicts-with-active-rename'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/source.txt`, 'source')
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()
  await Explorer.renameDirent()
  await Explorer.updateEditingValue('target.txt')

  // act
  await FileSystem.writeFile(`${tmpDir}/target.txt`, 'target')
  await Explorer.acceptEdit()

  // assert
  const input = Locator('input')
  const errorMessage = Locator('.ExplorerErrorMessage')
  await expect(input).toBeVisible()
  await expect(input).toHaveClass('InputValidationError')
  await expect(errorMessage).toHaveText('A file or folder **target.txt** already exists at this location. Please choose a different name.')
  await FileSystem.shouldHaveFile(`${tmpDir}/source.txt`, 'source')
  await FileSystem.shouldHaveFile(`${tmpDir}/target.txt`, 'target')
}
