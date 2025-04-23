import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const label: VirtualDomNode = {
  type: VirtualDomElements.Div,
  className: ClassNames.Label,
  childCount: 1,
}

export const getLabelDom = (name: string): readonly VirtualDomNode[] => {
  return [label, text(name)]
}
