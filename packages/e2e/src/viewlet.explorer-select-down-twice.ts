import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-select-down-twice'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/a.txt` },
    { content: '', uri: `${tmpDir}/b.txt` },
    { content: '', uri: `${tmpDir}/c.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  await Explorer.selectDown()
  await Explorer.selectDown()

  for (const fileName of ['a.txt', 'b.txt', 'c.txt']) {
    const file = Locator(`.TreeItem[aria-label="${fileName}"]`)
    await expect(file).toHaveClass('TreeItemActive')
  }
  const lastFile = Locator('.TreeItem[aria-label="c.txt"]')
  await expect(lastFile).toHaveId('TreeItemActive')
}
