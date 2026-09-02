import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drag-file-into-folder'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/src`)
  await FileSystem.writeFile(`${tmpDir}/Main.elm`, 'module Main exposing (main)')
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.handleDragOverIndex(0)
  await Explorer.handleDropIndex([], [`${tmpDir}/Main.elm`], 0)

  // assert
  const originalFile = Locator(`.TreeItem[title="${tmpDir}/Main.elm"]`)
  const movedFile = Locator(`.TreeItem[title="${tmpDir}/src/Main.elm"]`)
  await expect(originalFile).toBeHidden()
  await expect(movedFile).toBeVisible()
  await FileSystem.shouldHaveFile(`${tmpDir}/src/Main.elm`, 'module Main exposing (main)')
}
