import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { syncExpandedPaths } from '../src/parts/SyncExpandedPaths/SyncExpandedPaths.ts'

test('syncExpandedPaths adds expanded visible folders and removes explicitly collapsed folders', () => {
  const state = {
    ...createDefaultState(),
    expandedPaths: ['/workspace/collapsed', '/workspace/hidden'],
    items: [
      { depth: 1, name: 'expanded', selected: false, type: DirentType.DirectoryExpanded, uri: '/workspace/expanded' },
      { depth: 1, name: 'collapsed', selected: false, type: DirentType.Directory, uri: '/workspace/collapsed' },
    ],
  }

  const result = syncExpandedPaths(state)

  expect(result.expandedPaths).toEqual(['/workspace/hidden', '/workspace/expanded'])
})

test('syncExpandedPaths preserves hidden descendant expansion', () => {
  const state = {
    ...createDefaultState(),
    expandedPaths: ['/workspace/parent/child'],
    items: [{ depth: 1, name: 'parent', selected: false, type: DirentType.Directory, uri: '/workspace/parent' }],
  }

  const result = syncExpandedPaths(state)

  expect(result.expandedPaths).toEqual(['/workspace/parent/child'])
})

test('syncExpandedPaths does nothing when preservation is disabled', () => {
  const state = {
    ...createDefaultState(),
    expandedPaths: ['/workspace/folder'],
    items: [{ depth: 1, name: 'folder', selected: false, type: DirentType.Directory, uri: '/workspace/folder' }],
    preserveExpandState: false,
  }

  expect(syncExpandedPaths(state)).toBe(state)
})
