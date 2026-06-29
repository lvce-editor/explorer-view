import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-rename-long-name-input-scroll'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const originalName = `${'a'.repeat(80)}.txt`
  const renamedName = `${'b'.repeat(80)}.txt`
  await FileSystem.writeFile(`${tmpDir}/${originalName}`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  // act
  await Explorer.renameDirent()

  // assert
  const input = Locator('input')
  await expect(input).toBeVisible()
  await expect(input).toHaveValue(originalName)

  // act
  await Explorer.updateEditingValue(renamedName)
  await Explorer.acceptEdit()

  // assert
  const renamed = Locator(`.TreeItem[aria-label="${renamedName}"]`)
  await expect(input).toBeHidden()
  await expect(renamed).toBeVisible()
  await expect(renamed).toHaveId('TreeItemActive')
}
