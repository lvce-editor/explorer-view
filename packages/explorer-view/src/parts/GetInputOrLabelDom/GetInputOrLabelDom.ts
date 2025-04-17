import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetInputDom from '../GetInputDom/GetInputDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const label: VirtualDomNode = {
  type: VirtualDomElements.Div,
  className: ClassNames.Label,
  childCount: 1,
}

export const getInputOrLabelDom = (isEditing: boolean, hasEditingError: boolean, name: string): readonly VirtualDomNode[] => {
  if (isEditing) {
    return GetInputDom.getInputDom(hasEditingError)
  }
  return [label, text(name)]
}
