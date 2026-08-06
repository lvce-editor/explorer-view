import { expect, test } from '@jest/globals'
import { getListItemsVirtualDom } from '../src/parts/GetListItemsVirtualDom/GetListItemsVirtualDom.ts'

test('registers pointer and native paste handlers on the explorer tree', () => {
  const [tree] = getListItemsVirtualDom([], -1, false, [])

  expect(tree).toMatchObject({
    onPaste: 26,
    onPointerDown: 14,
    onPointerUp: 25,
  })
})
