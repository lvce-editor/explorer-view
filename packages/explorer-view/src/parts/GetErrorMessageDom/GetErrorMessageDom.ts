import { type VirtualDomNode, text } from '@lvce-editor/virtual-dom-worker'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as Px from '../Px/Px.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getErrorMessageDom = (errorMessage: string): readonly VirtualDomNode[] => {
  if (!errorMessage) {
    return []
  }

  const heightString = Px.px(20)
  const translateString = Px.position(0, 20)
  return [
    {
      type: VirtualDomElements.Div,
      className: MergeClassNames.mergeClassNames('ExplorerErrorMessage'),
      childCount: 1,
      height: heightString,
      translate: translateString,
    },
    text(errorMessage),
  ]
}
