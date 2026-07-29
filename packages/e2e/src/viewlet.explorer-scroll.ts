import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-scroll'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFiles(
    Array.from({ length: 100 }, (_, index) => ({
      content: '',
      uri: `${tmpDir}/file-${index.toString().padStart(2, '0')}.txt`,
    })),
  )
  await Workspace.setPath(tmpDir)
  const file00 = Locator('.TreeItem', { hasText: 'file-00.txt' })
  const file23 = Locator('.TreeItem', { hasText: 'file-23.txt' })
  const file50 = Locator('.TreeItem', { hasText: 'file-50.txt' })
  const file99 = Locator('.TreeItem', { hasText: 'file-99.txt' })
  const list = Locator('.ListItems')

  // act
  await Explorer.focusFirst()

  // assert
  await expect(file00).toBeVisible()
  await expect(file00).toHaveId('TreeItemActive')

  // act
  await list.dispatchEvent('wheel', {
    bubbles: true,
    deltaMode: 0,
    deltaY: 500,
  } as unknown as string)
  await Explorer.refresh()

  // assert
  await expect(file00).toBeHidden()
  await expect(file23).toBeVisible()

  // act
  await list.dispatchEvent('wheel', {
    bubbles: true,
    deltaMode: 0,
    deltaY: -500,
  } as unknown as string)
  await Explorer.refresh()

  // assert
  await expect(file00).toBeVisible()

  // act
  await Explorer.focusIndex(50)

  // assert
  await expect(file50).toBeVisible()
  await expect(file50).toHaveId('TreeItemActive')

  // act
  await Explorer.focusIndex(99)

  // assert
  await expect(file99).toBeVisible()
  await expect(file99).toHaveId('TreeItemActive')

  // act
  await Explorer.focusFirst()

  // assert
  await expect(file00).toHaveId('TreeItemActive')
}
