import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as GetInputDom from '../GetInputDom/GetInputDom.ts'
import { getLabelDom } from '../GetLabelDom/GetLabelDom.ts'

export const getInputOrLabelDom = (
  isEditing: boolean,
  hasEditingError: boolean,
  name: string,
  isCut: boolean,
  isIgnored: boolean,
): readonly VirtualDomNode[] => {
  if (isEditing) {
    return GetInputDom.getInputDom(hasEditingError)
  }
  return getLabelDom(name, isCut || isIgnored)
}
