import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as ExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

export const getExplorerWelcomeVirtualDom = (isWide: boolean): any[] => {
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
      className: MergeClassNames.mergeClassNames(ClassNames.Button, ClassNames.ButtonPrimary, isWide ? 'ButtonWide' : 'ButtonNarrow'),
      childCount: 1,
      onClick: DomEventListenerFunctions.handleClickOpenFolder,
    },
    text(ExplorerStrings.openFolder()),
  ]
}
