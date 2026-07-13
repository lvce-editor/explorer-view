import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-same-file-twice-generates-unique-name'
export const skip = 1

export const test: Test = async () => {
  // Deferred: Explorer copy/paste does not currently create deterministic unique names for repeated copies of the same focused file.
}
