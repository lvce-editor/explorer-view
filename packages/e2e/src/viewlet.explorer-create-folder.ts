// TODO test might be flaky https://github.com/lvce-editor/lvce-editor/runs/7490211933?check_suite_focus=true

import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-folder'

export const test: Test = async ({ Command, FileSystem, Workspace, Explorer, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')

  await Workspace.setPath(tmpDir)

  // act
  await Command.execute('Explorer.newFolder')

  // assert
  const inputBox = Locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()

  // act
  await Explorer.updateEditingValue('folder')
  await Explorer.acceptEdit()

  // assert
  const newFolder = Locator('text=folder')
  await expect(newFolder).toBeVisible()
}
