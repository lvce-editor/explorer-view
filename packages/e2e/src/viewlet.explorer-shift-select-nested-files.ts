import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-shift-select-nested-files'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/folder/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/z.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.handleClick(0)

  await Explorer.focusIndex(1)
  await Explorer.handleClickAt(false, 0, false, true, 300, 125)

  for (const name of ['a.txt', 'b.txt', 'z.txt']) {
    const item = Locator(`.TreeItem[aria-label="${name}"]`)
    await expect(item).toHaveClass('TreeItemActive')
  }
}
