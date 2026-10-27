import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-gitignore-live'

export const test: Test = async ({ Settings }) => {
  await Settings.update({ 'explorer.gitIgnoreDecorations': true, 'files.workspaceWatcher.enabled': false })
}
