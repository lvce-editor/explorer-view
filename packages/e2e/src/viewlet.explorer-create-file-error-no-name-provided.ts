// TODO test is flaky https://github.com/lvce-editor/lvce-editor/runs/7883530122?check_suite_focus=true

import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-file-error-no-name-provided'

export const test: Test = async ({ FileSystem, Workspace, Explorer, expect, Locator }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.newFile()

  // assert
  const inputBox = Locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()

  // act
  await Explorer.acceptEdit()

  // assert
  await expect(inputBox).toHaveClass('InputValidationError')

  // TODO there should be an error message below the input box
  // const dialog = Locator('#Dialog')
  // const errorMessage = dialog.locator('#DialogBodyErrorMessage')
  // await expect(errorMessage).toHaveText('Error: file name must not be empty')
}
