import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-shift-range-after-scroll-and-refresh'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: create enough files to require scrolling and select a range across the viewport.
  // TODO act: scroll and refresh Explorer.
  // TODO assert: selection and focus remain coherent with visible rows.
}
