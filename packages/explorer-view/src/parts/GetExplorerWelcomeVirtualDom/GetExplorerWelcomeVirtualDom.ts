import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as ExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import * as InputName from '../InputName/InputName.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

export const getExplorerWelcomeVirtualDom = (isWide: boolean): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.Explorer),
      tabIndex: 0,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: ClassNames.Welcome,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.WelcomeMessage,
      type: VirtualDomElements.P,
    },
    text(ExplorerStrings.youHaveNotYetOpenedAFolder()),
    {
      childCount: 1,
      className: MergeClassNames.mergeClassNames(
        ClassNames.Button,
        ClassNames.ButtonPrimary,
        isWide ? ClassNames.ButtonWide : ClassNames.ButtonNarrow,
      ),
      name: InputName.OpenFolder,
      onClick: DomEventListenerFunctions.HandleClickOpenFolder,
      type: VirtualDomElements.Button,
    },
    text(ExplorerStrings.openFolder()),
  ]
}
