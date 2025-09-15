import { test, expect, beforeAll } from '@jest/globals'
import { IconThemeWorker } from '@lvce-editor/rpc-registry'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as RequestFileIcons from '../src/parts/RequestFileIcons/RequestFileIcons.ts'

const handleFileIcons = (requests: readonly any[]): readonly string[] => {
  return requests.map((param) => {
    if (param.type === 2) {
      return `folder-icon`
    }
    return `file-icon`
  })
}

beforeAll(() => {
  IconThemeWorker.registerMockRpc({
    'IconTheme.getFileIcon': (param: any) => `file-icon-${param.name}`,
    'IconTheme.getFolderIcon': (param: any) => `folder-icon-${param.name}`,
    'IconTheme.getIcons': (requests: any[]) => handleFileIcons(requests),
  })
})

test('requestFileIcons - empty requests', async () => {
  const result = await RequestFileIcons.requestFileIcons([])
  expect(result).toEqual([])
})

test('requestFileIcons - file icons', async () => {
  const requests = [{ type: DirentType.File, name: 'file.txt', path: '/test/file.txt' }]
  const result = await RequestFileIcons.requestFileIcons(requests)
  expect(result).toEqual(['file-icon'])
})

test('requestFileIcons - folder icons', async () => {
  const requests = [{ type: DirentType.Directory, name: 'folder', path: '/test/folder' }]
  const result = await RequestFileIcons.requestFileIcons(requests)
  expect(result).toEqual(['folder-icon'])
})

test('requestFileIcons - mixed requests', async () => {
  const requests = [
    { type: DirentType.File, name: 'file.txt', path: '/test/file.txt' },
    { type: DirentType.Directory, name: 'folder', path: '/test/folder' },
  ]
  const result = await RequestFileIcons.requestFileIcons(requests)
  expect(result).toEqual(['file-icon', 'folder-icon'])
})
