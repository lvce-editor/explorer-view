import { text } from '@lvce-editor/virtual-dom-worker'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

const getParentNode = (childCount: number): VirtualDomNode => {
  return {
    childCount,
    className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.Explorer),
    role: AriaRoles.None,
    type: VirtualDomElements.Div,
  }
}

export const getLoadErrorVirtualDom = (loadErrorMessage: string): readonly VirtualDomNode[] => {
  const errorDom: readonly VirtualDomNode[] = [
    {
      childCount: 1,
      type: VirtualDomElements.Div,
    },
    text(loadErrorMessage),
  ]
  const parentNode = getParentNode(1)
  return [parentNode, ...errorDom]
}