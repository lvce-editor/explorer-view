import { type VirtualDomNode, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as Px from '../Px/Px.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getErrorMessageDom = (errorMessage: string, errorMessageLeft: number, errorMessageTop: number): readonly VirtualDomNode[] => {
  if (!errorMessage) {
    return []
  }

  const translateString = Px.position(errorMessageLeft, errorMessageTop)
  return [
    {
      type: VirtualDomElements.Div,
      className: MergeClassNames.mergeClassNames(ClassNames.ExplorerErrorMessage),
      childCount: 1,
      translate: translateString,
    },
    text(errorMessage),
  ]
}
