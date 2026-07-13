import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-rtl-bidi-file-names'

const rtlName = '\u{05E9}\u{05DC}\u{05D5}\u{05DD}.txt'
const bidiName = 'abc\u{202E}txt'

export const test: Test = async ({ ClipBoard, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/${rtlName}`, '')
  await FileSystem.writeFile(`${tmpDir}/${bidiName}`, '')
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.focusIndex(1)
  await Explorer.copyPath()
  await Explorer.renameDirent()
  await Explorer.updateEditingValue('\u{05E9}\u{05DC}\u{05D5}\u{05DD}-renamed.txt')
  await Explorer.acceptEdit()

  // assert
  const renamed = Locator('.TreeItem[aria-label="\u{05E9}\u{05DC}\u{05D5}\u{05DD}-renamed.txt"]')
  const bidi = Locator('.TreeItem').nth(0)
  await ClipBoard.shouldHaveText(`${tmpDir}/${rtlName}`)
  await expect(bidi).toHaveAttribute('aria-label', bidiName)
  await expect(renamed).toBeVisible()
  await expect(renamed).toHaveId('TreeItemActive')
}
