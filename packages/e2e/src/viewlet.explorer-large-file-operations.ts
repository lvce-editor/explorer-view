import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-large-file-operations'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()

  // Create a large file (100MB)
  const largeContent = 'x'.repeat(100 * 1024 * 1024) // 100MB of 'x' characters
  await FileSystem.writeFile(`${tmpDir}/large-file.txt`, largeContent)

  // Create a medium file (10MB)
  const mediumContent = 'y'.repeat(10 * 1024 * 1024) // 10MB of 'y' characters
  await FileSystem.writeFile(`${tmpDir}/medium-file.txt`, mediumContent)

  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()

  // Test 1: Copy large file
  await Explorer.focusIndex(1) // Focus on large-file.txt
  await Explorer.handleCopy()
  await Explorer.focusIndex(0) // Focus on directory root
  await Explorer.handlePaste()

  // Verify copied file exists
  const copiedFile = Locator('.TreeItem', { hasText: 'large-file (1).txt' })
  await expect(copiedFile).toBeVisible()

  // Test 2: Rename large file
  await Explorer.focusIndex(1) // Focus on original large file
  await Explorer.renameDirent()
  await Explorer.updateEditingValue('renamed-large-file.txt')
  await Explorer.acceptEdit()

  // Verify renamed file exists
  const renamedFile = Locator('.TreeItem', { hasText: 'renamed-large-file.txt' })
  await expect(renamedFile).toBeVisible()

  // Test 3: Delete large file
  await Explorer.focusIndex(1) // Focus on copied large file
  await Explorer.removeDirent()

  // Verify file is deleted
  await expect(copiedFile).not.toBeVisible()

  // Test 4: Create new large file
  await Explorer.newFile()
  await Explorer.updateEditingValue('new-large-file.txt')
  await Explorer.acceptEdit()

  // Verify new file exists
  const newFile = Locator('.TreeItem', { hasText: 'new-large-file.txt' })
  await expect(newFile).toBeVisible()

  // Test 5: Move medium file to subdirectory
  await FileSystem.mkdir(`${tmpDir}/subdir`)
  await Explorer.refresh()
  await Explorer.expandRecursively()

  await Explorer.focusIndex(2) // Focus on medium-file.txt
  await Explorer.handleCut()
  await Explorer.focusIndex(3) // Focus on subdir
  await Explorer.handlePaste()

  // Verify file moved to subdirectory
  await Explorer.focusIndex(3)
  await Explorer.expandRecursively()
  const movedFile = Locator('.TreeItem', { hasText: 'medium-file.txt' })
  await expect(movedFile).toBeVisible()

  // Test 6: Test with very long filename
  const longName = 'a'.repeat(200) + '.txt'
  await FileSystem.writeFile(`${tmpDir}/${longName}`, 'content')
  await Explorer.refresh()

  const longNameFile = Locator('.TreeItem', { hasText: longName })
  await expect(longNameFile).toBeVisible()

  // Test 7: Test file with special characters
  const specialName = 'file-with-special-chars-!@#$%^&()_+-=[]{};:,.<>?/~`'
  await FileSystem.writeFile(`${tmpDir}/${specialName}.txt`, 'content')
  await Explorer.refresh()

  const specialNameFile = Locator('.TreeItem', { hasText: `${specialName}.txt` })
  await expect(specialNameFile).toBeVisible()
}
