import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getInternalDragPaths } from '../src/parts/GetInternalDragPaths/GetInternalDragPaths.ts'

const items: readonly ExplorerItem[] = [
  { depth: 1, name: 'Main.elm', path: '/workspace/Main.elm', selected: false, type: DirentType.File },
  { depth: 1, name: 'src', path: '/workspace/src', selected: false, type: DirentType.Directory },
]

test('returns Explorer paths matching retained drag uris', () => {
  expect(getInternalDragPaths(items, ['file:///workspace/Main.elm'])).toEqual(['/workspace/Main.elm'])
})

test('preserves non-file workspace uris', () => {
  const memoryItems: readonly ExplorerItem[] = [
    { depth: 1, name: 'Main.elm', path: 'memfs:///workspace/Main.elm', selected: false, type: DirentType.File },
  ]

  expect(getInternalDragPaths(memoryItems, ['memfs:///workspace/Main.elm'])).toEqual(['memfs:///workspace/Main.elm'])
})

test('rejects a partially external uri list', () => {
  expect(getInternalDragPaths(items, ['file:///workspace/Main.elm', 'file:///tmp/external.txt'])).toEqual([])
})
