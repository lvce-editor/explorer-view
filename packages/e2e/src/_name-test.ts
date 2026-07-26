import type { Test } from '@lvce-editor/test-with-playwright'

export const createFileNameTest = (fileName: string): Test => {
  return async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
    const tmpDir = await FileSystem.getTmpDir()
    await Workspace.setPath(tmpDir)

    await Explorer.newFile()
    await Explorer.updateEditingValue(fileName)
    await Explorer.acceptEdit()

    const file = Locator(`.TreeItem[aria-label="${fileName}"]`)
    await expect(file).toBeVisible()
    await expect(file).toHaveId('TreeItemActive')
  }
}

export const createFolderNameTest = (folderName: string): Test => {
  return async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
    const tmpDir = await FileSystem.getTmpDir()
    await Workspace.setPath(tmpDir)

    await Explorer.newFolder()
    await Explorer.updateEditingValue(folderName)
    await Explorer.acceptEdit()

    const folder = Locator(`.TreeItem[aria-label="${folderName}"]`)
    await expect(folder).toBeVisible()
    await expect(folder).toHaveAttribute('aria-expanded', 'false')
    await expect(folder).toHaveId('TreeItemActive')
  }
}

export const renameFileNameTest = (fileName: string): Test => {
  return async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
    const tmpDir = await FileSystem.getTmpDir()
    await FileSystem.writeFile(`${tmpDir}/file.txt`, '')
    await Workspace.setPath(tmpDir)
    await Explorer.focusFirst()

    await Explorer.renameDirent()
    await Explorer.updateEditingValue(fileName)
    await Explorer.acceptEdit()

    const original = Locator('.TreeItem[aria-label="file.txt"]')
    const renamed = Locator(`.TreeItem[aria-label="${fileName}"]`)
    await expect(original).toBeHidden()
    await expect(renamed).toBeVisible()
    await expect(renamed).toHaveId('TreeItemActive')
  }
}

export const renameFolderNameTest = (folderName: string): Test => {
  return async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
    const tmpDir = await FileSystem.getTmpDir()
    await FileSystem.mkdir(`${tmpDir}/folder`)
    await Workspace.setPath(tmpDir)
    await Explorer.focusFirst()

    await Explorer.renameDirent()
    await Explorer.updateEditingValue(folderName)
    await Explorer.acceptEdit()

    const original = Locator('.TreeItem[aria-label="folder"]')
    const renamed = Locator(`.TreeItem[aria-label="${folderName}"]`)
    await expect(original).toBeHidden()
    await expect(renamed).toBeVisible()
    await expect(renamed).toHaveId('TreeItemActive')
  }
}
