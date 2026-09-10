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

  await expect(Locator('.ExplorerErrorMessage')).toHaveCount(0)
  await Explorer.acceptEdit()
  await expect(Locator('.Explorer').locator('text=install.sh')).toHaveCount(2)
}
