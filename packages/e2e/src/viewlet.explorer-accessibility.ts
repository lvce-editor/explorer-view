import type { Test } from '@lvce-editor/test-with-playwright'
// manual accessibility tests

// explorer
// nvda says: "Files explorer tree"
// windows narrator says: "Files explorer, tree"
// orca says: "Files explorer tree"

// explorer item
// nvda says: "sample folder, collapsed, two of five, level 1"
// windows narrator says: "sample folder, two of five, collapsed, selected, heading level 1" ❌
// orca says: "sample-folder, collapsed"

export const name = 'viewlet.explorer-accessibility'

export const test: Test = async ({ FileSystem, Workspace, Main, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/languages`)
  await FileSystem.mkdir(`${tmpDir}/sample-folder`)
  await FileSystem.writeFile(`${tmpDir}/test.txt`, 'div')
  await FileSystem.writeFile(`${tmpDir}/languages/index.html`, 'div')
  await FileSystem.writeFile(`${tmpDir}/sample-folder/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/sample-folder/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/sample-folder/c.txt`, '')

  // act
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/test.txt`)

  const titleLanguages = '/languages'
  const treeItemLanguages = Locator(`.TreeItem[title$="${titleLanguages}"]`)
  await expect(treeItemLanguages).toHaveAttribute('tabindex', null)
  await expect(treeItemLanguages).toHaveAttribute('role', 'treeitem')
  await expect(treeItemLanguages).toHaveAttribute('aria-level', '1')
  await expect(treeItemLanguages).toHaveAttribute('aria-posinset', '1')
  await expect(treeItemLanguages).toHaveAttribute('aria-setsize', '3')
  await expect(treeItemLanguages).toHaveAttribute('aria-expanded', 'false')

  const titleSampleFolder = '/sample-folder'
  const treeItemSampleFolder = Locator(`.TreeItem[title$="${titleSampleFolder}"]`)
  await expect(treeItemSampleFolder).toHaveAttribute('tabindex', null)
  await expect(treeItemSampleFolder).toHaveAttribute('role', 'treeitem')
  await expect(treeItemSampleFolder).toHaveAttribute('aria-level', '1')
  await expect(treeItemSampleFolder).toHaveAttribute('aria-posinset', '2')
  await expect(treeItemSampleFolder).toHaveAttribute('aria-setsize', '3')
  await expect(treeItemSampleFolder).toHaveAttribute('aria-expanded', 'false')

  const titleTest = '/test.txt'
  const treeItemTestTxt = Locator(`.TreeItem[title$="${titleTest}"]`)
  await expect(treeItemTestTxt).toHaveAttribute('tabindex', null)
  await expect(treeItemTestTxt).toHaveAttribute('aria-level', '1')
  await expect(treeItemTestTxt).toHaveAttribute('aria-posinset', '3')
  await expect(treeItemTestTxt).toHaveAttribute('aria-setsize', '3')
  // await expect(treeItemTestTxt).not.toHaveAttribute('aria-expanded', 'false') // TODO

  await treeItemLanguages.click()
  await expect(treeItemLanguages).toHaveAttribute('aria-level', '1')
  await expect(treeItemLanguages).toHaveAttribute('aria-posinset', '1')
  await expect(treeItemLanguages).toHaveAttribute('aria-setsize', '3')
  await expect(treeItemLanguages).toHaveAttribute('aria-expanded', 'true')

  const titleIndexHtml = '/languages/index.html'
  const treeItemIndexHtml = Locator(`.TreeItem[title$="${titleIndexHtml}"]`)
  await expect(treeItemIndexHtml).toHaveAttribute('tabindex', null)
  await expect(treeItemIndexHtml).toHaveAttribute('aria-level', '2')
  await expect(treeItemIndexHtml).toHaveAttribute('aria-posinset', '1')
  await expect(treeItemIndexHtml).toHaveAttribute('aria-setsize', '1')
  // await expect(treeItemIndexHtml).not.toHaveAttribute('aria-expanded', 'false') // TODO
}
