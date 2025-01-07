import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getChevronDownVirtualDom = (): VirtualDomNode => {
  return {
    type: VirtualDomElements.Div,
    className: `${ClassNames.Chevron} MaskIconChevronDown`,
    childCount: 0,
  }
}

export const getChevronRightVirtualDom = (): VirtualDomNode => {
  return {
    type: VirtualDomElements.Div,
    className: `${ClassNames.Chevron} MaskIconChevronRight`,
    childCount: 0,
  }
}
