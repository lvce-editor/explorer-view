import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const label: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.Label,
  type: VirtualDomElements.Div,
}

const dimmedLabel: VirtualDomNode = {
  childCount: 1,
  className: MergeClassNames.mergeClassNames(ClassNames.Label, ClassNames.LabelCut),
  type: VirtualDomElements.Div,
}

export const getLabelDom = (isEditing: boolean, name: string, isDimmed: boolean): readonly VirtualDomNode[] => {
  if (isEditing) {
    return []
  }
  if (isDimmed) {
    return [dimmedLabel, text(name)]
  }
  return [label, text(name)]
}
