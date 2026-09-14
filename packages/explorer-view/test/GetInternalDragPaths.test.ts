import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getInternalDragPaths } from '../src/parts/GetInternalDragPaths/GetInternalDragPaths.ts'

const items: readonly ExplorerItem[] = [
  { depth: 1, name: 'Main.elm', selected: false, type: DirentType.File, uri: '/workspace/Main.elm' },
  { depth: 1, name: 'src', selected: false, type: DirentType.Directory, uri: '/workspace/src' },
]

test('returns Explorer paths matching retained drag uris', () => {
  expect(getInternalDragPaths(items, ['file:///workspace/Main.elm'])).toEqual(['/workspace/Main.elm'])
})

test('preserves non-file workspace uris', () => {
  const memoryItems: readonly ExplorerItem[] = [
    { depth: 1, name: 'Main.elm', selected: false, type: DirentType.File, uri: 'memfs:///workspace/Main.elm' },
  ]

  expect(getInternalDragPaths(memoryItems, ['memfs:///workspace/Main.elm'])).toEqual(['memfs:///workspace/Main.elm'])
})

test('matches a remote folder uri with a trailing slash', () => {
  const remoteItems: readonly ExplorerItem[] = [
    { depth: 1, name: 'src', selected: false, type: DirentType.Directory, uri: 'remote-ssh://test-host/workspace/src' },
  ]

  expect(getInternalDragPaths(remoteItems, ['remote-ssh://test-host/workspace/src/'])).toEqual(['remote-ssh://test-host/workspace/src'])
})

test('rejects a partially external uri list', () => {
  expect(getInternalDragPaths(items, ['file:///workspace/Main.elm', 'file:///tmp/external.txt'])).toEqual([])
})
