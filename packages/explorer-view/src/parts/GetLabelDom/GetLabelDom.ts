import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const label: VirtualDomNode = {
  type: VirtualDomElements.Div,
  className: ClassNames.Label,
  childCount: 1,
}

export const getLabelDom = (name: string, isDimmed: boolean): readonly VirtualDomNode[] => {
  if (isDimmed) {
    return [
      {
        type: VirtualDomElements.Div,
        className: MergeClassNames.mergeClassNames(ClassNames.Label, ClassNames.LabelCut),
        childCount: 1,
      },
      text(name),
    ]
  }
  return [label, text(name)]
}
