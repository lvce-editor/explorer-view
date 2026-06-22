import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-double-click-blur'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)

  // act: double-click on empty space creates input (with empty value),
  // handleInputBlur with empty value cancels — both fire concurrently
  await Promise.all([Command.execute('Explorer.handleDoubleClick', 20, 100), Command.execute('Explorer.handleInputBlur')])

  // assert: explorer should be stable — no crash, no duplicate items
  // file1.txt should always be visible
  const file1 = Locator('.TreeItem[aria-label="file1.txt"]')
  await expect(file1).toBeVisible()

  // At most 2 tree items (file1.txt + possibly editing row)
  const treeItems = Locator('.TreeItem')
  await expect(treeItems.nth(2)).toBeHidden()

  // input should be hidden (blur cancelled empty input) or at most 1 input
  const inputBox = Locator('input')
  await expect(inputBox.nth(1)).toBeHidden()
}
