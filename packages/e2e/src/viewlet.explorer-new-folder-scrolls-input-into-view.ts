import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-new-folder-scrolls-input-into-view'

export const test: Test = async ({ ContextMenu, expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  for (let index = 0; index < 100; index++) {
    await FileSystem.mkdir(`${tmpDir}/parts/folder-${index}`)
  }
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.clickCurrent()

  await Explorer.openContextMenu(0)
  await ContextMenu.selectItem('New Folder...')

  const input = Locator('.Explorer input')
  await expect(input).toBeVisible()
  await expect(input).toBeFocused()
  await Explorer.updateEditingValue('zz-new-folder')
  await Explorer.acceptEdit()
  await expect(Locator('.Explorer').locator('text=zz-new-folder')).toBeVisible()
}
