import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-new-file-in-expanded-folder-scrolls-into-view'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  for (let i = 0; i < 40; i++) {
    await FileSystem.writeFile(`${tmpDir}/file-${i.toString().padStart(2, '0')}.txt`, '')
  }
  await FileSystem.mkdir(`${tmpDir}/target-folder`)
  await FileSystem.writeFile(`${tmpDir}/target-folder/existing.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.clickCurrent()

  // act
  await Explorer.newFile()

  // assert
  const input = Locator('input')
  await expect(input).toBeVisible()
  await expect(input).toBeFocused()

  // act
  await Explorer.updateEditingValue('created.txt')
  await Explorer.acceptEdit()

  // assert
  const created = Locator(`.TreeItem[title="${tmpDir}/target-folder/created.txt"]`)
  await expect(created).toBeVisible()
}
