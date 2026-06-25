import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-error-message-clears-after-successful-operation'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: trigger a validation or provider error during create or rename.
  // TODO act: perform a successful create or rename afterwards.
  // TODO assert: the old error message is cleared from Explorer.
}
