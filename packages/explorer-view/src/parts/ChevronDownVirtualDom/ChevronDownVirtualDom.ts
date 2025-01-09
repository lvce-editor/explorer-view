import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const chevronDownVirtualDom: VirtualDomNode = {
  type: VirtualDomElements.Div,
  className: `${ClassNames.Chevron} ${ClassNames.MaskIconChevronDown}`,
  childCount: 0,
}
