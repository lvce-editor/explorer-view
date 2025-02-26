import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as ExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

export const getExplorerWelcomeVirtualDom = (isWide: boolean): readonly VirtualDomNode[] => {
  return [
    {
      type: VirtualDomElements.Div,
      className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.Explorer),
      tabIndex: 0,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.Welcome,
      childCount: 2,
    },
    {
      type: VirtualDomElements.P,
      className: ClassNames.WelcomeMessage,
      childCount: 1,
    },
    text(ExplorerStrings.youHaveNotYetOpenedAFolder()),
    {
      type: VirtualDomElements.Button,
      className: MergeClassNames.mergeClassNames(
        ClassNames.Button,
        ClassNames.ButtonPrimary,
        isWide ? ClassNames.ButtonWide : ClassNames.ButtonNarrow,
      ),
      childCount: 1,
      onClick: DomEventListenerFunctions.HandleClickOpenFolder,
    },
    text(ExplorerStrings.openFolder()),
  ]
}
