import { expect, test } from '@jest/globals'
import * as AriaRoles from '../src/parts/AriaRoles/AriaRoles.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'
import * as GetIconVirtualDom from '../src/parts/GetIconVirtualDom/GetIconVirtualDom.ts'

test('getIconVirtualDom - with icon', () => {
  expect(GetIconVirtualDom.getIconVirtualDom('File')).toEqual({
    type: VirtualDomElements.Div,
    className: 'MaskIcon MaskIconFile',
    role: AriaRoles.None,
    childCount: 0,
  })
})

test('getIconVirtualDom - with custom element type', () => {
  expect(GetIconVirtualDom.getIconVirtualDom('Folder', VirtualDomElements.Div)).toEqual({
    type: VirtualDomElements.Div,
    className: 'MaskIcon MaskIconFolder',
    role: AriaRoles.None,
    childCount: 0,
  })
})
