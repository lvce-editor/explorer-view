import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-scroll'

export const test: Test = async ({ FileSystem, Workspace, Explorer }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  for (let i = 0; i < 100; i++) {
    const extension = i % 2 === 0 ? '.json' : '.txt'
    await FileSystem.writeFile(`${tmpDir}/file-${i}${extension}`, '')
  }
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  // act
  // TODO scroll
}
