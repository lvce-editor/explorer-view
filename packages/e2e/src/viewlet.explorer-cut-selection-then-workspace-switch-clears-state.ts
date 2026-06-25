import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-cut-selection-then-workspace-switch-clears-state'

export const test: Test = async ({ ClipBoard, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const firstRoot = await FileSystem.getTmpDir()
  const secondRoot = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${firstRoot}/cut-me.txt`, 'first')
  await FileSystem.writeFile(`${secondRoot}/second.txt`, 'second')
  await Workspace.setPath(firstRoot)
  await Explorer.focusFirst()
  await Explorer.handleCut()

  // act
  await Workspace.setPath(secondRoot)

  // assert
  const oldCutItem = Locator('.TreeItem[aria-label="cut-me.txt"]')
  const secondItem = Locator('.TreeItem[aria-label="second.txt"]')
  await expect(oldCutItem).toBeHidden()
  await expect(secondItem).toBeVisible()
  await FileSystem.shouldHaveFile(`${firstRoot}/cut-me.txt`, 'first')
  await FileSystem.shouldHaveFile(`${secondRoot}/second.txt`, 'second')
}
