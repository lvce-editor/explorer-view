import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-shift-select-different-nesting-levels'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/outer/inner`)
  await FileSystem.writeFile(`${tmpDir}/outer/inner/deep.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/z.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.handleClick(0)
  await Explorer.handleClick(1)

  await Explorer.focusIndex(1)
  await Explorer.handleClickAt(false, 0, false, true, 300, 125)

  for (const name of ['inner', 'deep.txt', 'z.txt']) {
    const item = Locator(`.TreeItem[aria-label="${name}"]`)
    await expect(item).toHaveClass('TreeItemActive')
  }
}
