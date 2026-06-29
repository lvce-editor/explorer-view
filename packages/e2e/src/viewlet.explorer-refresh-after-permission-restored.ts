import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-refresh-after-permission-restored'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: use a provider or fixture that first denies folder access.
  // TODO act: restore permission and refresh Explorer.
  // TODO assert: the folder recovers from the error state and renders its children.
}
