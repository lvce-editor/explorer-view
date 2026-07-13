import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-refresh-after-permission-restored'
export const skip = 1

export const test: Test = async () => {
  // Deferred: the e2e runner does not register the FileSystemProvider.setError hook needed to simulate permission restoration.
}
