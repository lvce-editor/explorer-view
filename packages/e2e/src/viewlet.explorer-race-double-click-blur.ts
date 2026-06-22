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
  const inputBox = Locator('input')
  const treeItems = Locator('.TreeItem')
  // Either input is hidden (blur cancelled it) or visible (double-click created it)
  const inputCount = await inputBox.count()
  const itemCount = await treeItems.count()
  // input visible → 2 tree items (1 file + 1 editing), input hidden → 1 tree item
  if (inputCount === 0) {
    await expect(treeItems).toHaveCount(1)
  } else {
    await expect(treeItems).toHaveCount(2)
  }
}
