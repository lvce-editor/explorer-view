import { expect, test } from '@jest/globals'
import * as AriaRoles from '../src/parts/AriaRoles/AriaRoles.ts'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as GetFileIconVirtualDom from '../src/parts/GetFileIconVirtualDom/GetFileIconVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getFileIconVirtualDom - with icon path', () => {
  expect(GetFileIconVirtualDom.getFileIconVirtualDom('/icons/file.svg')).toEqual({
    type: VirtualDomElements.Img,
    className: ClassNames.FileIcon,
    src: '/icons/file.svg',
    role: AriaRoles.None,
    childCount: 0,
  })
})

test('getFileIconVirtualDom - empty icon path', () => {
  expect(GetFileIconVirtualDom.getFileIconVirtualDom('')).toEqual({
    type: VirtualDomElements.Img,
    className: ClassNames.FileIcon,
    src: '',
    role: AriaRoles.None,
    childCount: 0,
  })
})
