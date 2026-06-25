import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-large-directory-typeahead-focus'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  for (let i = 0; i < 200; i++) {
    await FileSystem.writeFile(`${tmpDir}/file-${i.toString().padStart(3, '0')}.txt`, '')
  }
  await FileSystem.writeFile(`${tmpDir}/target-special.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focus()

  // act
  for (const key of 'target') {
    await Command.execute('Explorer.handleKeyDown', key)
  }

  // assert
  const target = Locator('.TreeItem[aria-label="target-special.txt"]')
  await expect(target).toBeVisible()
  await expect(target).toHaveId('TreeItemActive')
}
