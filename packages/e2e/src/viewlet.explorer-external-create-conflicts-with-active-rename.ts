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
  const source = Locator('.TreeItem[aria-label="source.txt"]')
  const target = Locator('.TreeItem[aria-label="target.txt"]')
  await expect(input).toBeHidden()
  await expect(source).toBeHidden()
  await expect(target).toBeVisible()
  await FileSystem.shouldHaveFile(`${tmpDir}/target.txt`, 'source')
}
