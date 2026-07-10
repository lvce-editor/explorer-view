import type { Test } from '@lvce-editor/test-with-playwright'
import { defaultExcludes, setExcludes } from './_setExcludes.ts'

export const name = 'viewlet.explorer-files-exclude-reveal-descendant'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/project/.git`)
  await FileSystem.writeFile(`${tmpDir}/project/.git/config`, '')
  await setExcludes(Settings, defaultExcludes)
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  const project = Locator('.TreeItem[aria-label="project"]')
  const config = Locator('.TreeItem[aria-label="config"]')
  const explorer = Locator('.Explorer')
  await Command.execute('Explorer.reveal', `${tmpDir}/project/.git/config`)

  await expect(explorer).toBeVisible()
  await expect(config).toBeHidden()
  await expect(project).toHaveId('TreeItemActive')
  await expect(project).toHaveAttribute('aria-expanded', 'false')
}
