import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-click-folder-expands-children'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/slow-folder`)
  await FileSystem.writeFile(`${tmpDir}/slow-folder/child.txt`, 'content')
  await Workspace.setUri(tmpDir)
  await SideBar.open('Explorer')

  // act
  await Explorer.focusFirst()
  const folder = Locator('.Explorer .TreeItem', { hasText: 'slow-folder' })
  await expect(folder).toBeVisible()
  await Explorer.clickCurrent()

  // assert
  await expect(folder).toHaveAttribute('aria-expanded', 'true')
  const child = Locator('.Explorer .TreeItem', { hasText: 'child.txt' })
  await expect(child).toBeVisible()
}
