import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { syncExpandedPaths } from '../src/parts/SyncExpandedPaths/SyncExpandedPaths.ts'

test('syncExpandedPaths adds expanded visible folders and removes explicitly collapsed folders', () => {
  const state = {
    ...createDefaultState(),
    expandedPaths: ['/workspace/collapsed', '/workspace/hidden'],
    items: [
      { depth: 1, name: 'expanded', path: '/workspace/expanded', selected: false, type: DirentType.DirectoryExpanded },
      { depth: 1, name: 'collapsed', path: '/workspace/collapsed', selected: false, type: DirentType.Directory },
    ],
  }

  const result = syncExpandedPaths(state)

  expect(result.expandedPaths).toEqual(['/workspace/hidden', '/workspace/expanded'])
})

test('syncExpandedPaths preserves hidden descendant expansion', () => {
  const state = {
    ...createDefaultState(),
    expandedPaths: ['/workspace/parent/child'],
    items: [{ depth: 1, name: 'parent', path: '/workspace/parent', selected: false, type: DirentType.Directory }],
  }

  const result = syncExpandedPaths(state)

  expect(result.expandedPaths).toEqual(['/workspace/parent/child'])
})

test('syncExpandedPaths does nothing when preservation is disabled', () => {
  const state = {
    ...createDefaultState(),
    expandedPaths: ['/workspace/folder'],
    items: [{ depth: 1, name: 'folder', path: '/workspace/folder', selected: false, type: DirentType.Directory }],
    preserveExpandState: false,
  }

  expect(syncExpandedPaths(state)).toBe(state)
})
