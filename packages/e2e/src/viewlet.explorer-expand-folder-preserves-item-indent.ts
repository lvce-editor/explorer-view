import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-expand-folder-preserves-item-indent'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/packages/extension/src/parts/CredentialStorage`)
  await FileSystem.mkdir(`${tmpDir}/packages/extension/src/parts/GetErrorMessage`)
  await FileSystem.mkdir(`${tmpDir}/packages/extension/src/parts/GithubClient/HelperBotClient`)
  await FileSystem.writeFile(`${tmpDir}/packages/extension/src/parts/GithubClient/GithubClient.ts`, '')
  await FileSystem.writeFiles(
    Array.from({ length: 50 }, (_, index) => ({
      content: '',
      uri: `${tmpDir}/root-${index.toString().padStart(2, '0')}.txt`,
    })),
  )
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  // act
  await Explorer.clickCurrent()
  await Explorer.focusIndex(1)
  await Explorer.clickCurrent()
  await Explorer.focusIndex(2)
  await Explorer.clickCurrent()
  await Explorer.focusIndex(3)
  await Explorer.clickCurrent()
  await Explorer.focusIndex(6)
  await Explorer.clickCurrent()

  // assert
  const parentFolder = Locator('.ListItems > .TreeItem[aria-label="GithubClient"]')
  const childFile = Locator('.ListItems > .TreeItem[aria-label="GithubClient.ts"]')
  const childFolder = Locator('.ListItems > .TreeItem[aria-label="HelperBotClient"]')
  await expect(parentFolder).toHaveCSS('padding-left', '44px')
  await expect(childFile).toHaveCSS('padding-left', '74px')
  await expect(childFolder).toHaveCSS('padding-left', '52px')
}
