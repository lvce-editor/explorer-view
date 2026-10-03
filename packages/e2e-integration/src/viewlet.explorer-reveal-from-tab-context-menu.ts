import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-reveal-from-tab-context-menu'

export const test: Test = async ({ Command, ContextMenu, expect, Explorer, FileSystem, KeyBoard, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const firstFile = `${tmpDir}/a.txt`
  const secondFile = `${tmpDir}/b.txt`
  await FileSystem.setFiles([
    { content: 'content 1', uri: firstFile },
    { content: 'content 2', uri: secondFile },
  ])
  await Workspace.setUri(tmpDir)

  const firstTreeItem = Locator('.TreeItem[aria-label="a.txt"]')
  const secondTreeItem = Locator('.TreeItem[aria-label="b.txt"]')
  await expect(firstTreeItem).toBeVisible()
  await expect(secondTreeItem).toBeVisible()

  await Explorer.focusIndex(0)
  await expect(firstTreeItem).toHaveId('TreeItemActive')

  await Main.openUri(secondFile)
  const tab = Locator('.MainTab[title$="b.txt"]')
  await expect(tab).toBeVisible()
  await Command.execute('Layout.hideSideBar')
  await expect(secondTreeItem).toBeHidden()

  // act
  await Main.handleTabContextMenu(0, 0, 0)
  const closeMenuItem = Locator('text=Close').first()
  await expect(closeMenuItem).toBeVisible()
  await ContextMenu.selectItem('Reveal in Explorer View')

  // assert
  await expect(secondTreeItem).toBeVisible()
  await expect(secondTreeItem).toHaveId('TreeItemActive')
  const explorerItems = Locator('.Explorer .ListItems')
  await expect(explorerItems).toBeFocused()

  // Keyboard navigation should work immediately after the context menu closes.
  await KeyBoard.press('ArrowUp')
  await expect(firstTreeItem).toHaveId('TreeItemActive')
}
