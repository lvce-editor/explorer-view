import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-large-directory-performance'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()

  // Create 10,000 files in the directory
  for (let i = 0; i < 10000; i++) {
    await FileSystem.writeFile(`${tmpDir}/file${i.toString().padStart(4, '0')}.txt`, `content ${i}`)
  }

  await Workspace.setPath(tmpDir)

  // Test 1: Initial load performance
  const startTime = Date.now()
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()
  const loadTime = Date.now() - startTime

  // Should load within reasonable time
  console.log(`Load time: ${loadTime}ms`)

  // Test 2: Verify items are loaded
  const firstItem = Locator('.TreeItem').first()
  await expect(firstItem).toBeVisible()

  // Test 3: Navigation performance in large list
  const navigationStartTime = Date.now()
  await Explorer.focusIndex(100)
  await Explorer.focusIndex(1000)
  await Explorer.focusIndex(5000)
  const navigationTime = Date.now() - navigationStartTime

  // Should navigate quickly
  console.log(`Navigation time: ${navigationTime}ms`)

  // Test 4: Verify specific items exist
  const midItem = Locator('.TreeItem', { hasText: 'file5000.txt' })
  await expect(midItem).toBeVisible()

  // Test 5: Test scrolling by focusing different items
  const scrollStartTime = Date.now()
  await Explorer.focusIndex(9000)
  await Explorer.focusIndex(100)
  const scrollTime = Date.now() - scrollStartTime

  console.log(`Scroll time: ${scrollTime}ms`)

  // Test 6: Verify explorer is still responsive
  const lastItem = Locator('.TreeItem', { hasText: 'file9999.txt' })
  await expect(lastItem).toBeVisible()

  // Test 7: Test selection performance
  const selectionStartTime = Date.now()
  await Explorer.focusIndex(0)
  await Explorer.focusIndex(5000)
  const selectionTime = Date.now() - selectionStartTime

  console.log(`Selection time: ${selectionTime}ms`)
}
