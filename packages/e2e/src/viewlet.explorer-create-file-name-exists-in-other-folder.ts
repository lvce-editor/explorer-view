import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-file-name-exists-in-other-folder'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/editor.devin`)
  await FileSystem.writeFile(`${tmpDir}/install.sh`, 'original')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.newFile()
  await Explorer.updateEditingValue('install.sh')

  const errorMessage = Locator('.ExplorerErrorMessage')
  await expect(errorMessage).toHaveCount(0)
  await Explorer.acceptEdit()
  const files = Locator('.Explorer').locator('text=install.sh')
  await expect(files).toHaveCount(2)
}
