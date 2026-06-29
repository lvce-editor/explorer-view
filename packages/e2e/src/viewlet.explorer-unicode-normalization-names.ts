import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-unicode-normalization-names'
export const skip = 1

export const test: Test = async () => {
  // Deferred: the current memfs-backed e2e filesystem normalizes NFC/NFD names to one entry, so distinct-name behavior cannot be asserted here.
}
