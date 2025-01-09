import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const chevronRightVirtualDom: VirtualDomNode = {
  type: VirtualDomElements.Div,
  className: `${ClassNames.Chevron} ${ClassNames.MaskIconChevronRight}`,
  childCount: 0,
}
