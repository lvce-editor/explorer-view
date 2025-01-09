import { expect, test } from '@jest/globals'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as ExplorerStrings from '../src/parts/ExplorerStrings/ExplorerStrings.ts'
import * as GetExplorerWelcomeVirtualDom from '../src/parts/GetExplorerWelcomeVirtualDom/GetExplorerWelcomeVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getExplorerWelcomeVirtualDom - wide', () => {
  expect(GetExplorerWelcomeVirtualDom.getExplorerWelcomeVirtualDom(true)).toEqual([
    {
      type: VirtualDomElements.Div,
      className: `${ClassNames.Viewlet} ${ClassNames.Explorer}`,
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
    ExplorerStrings.youHaveNotYetOpenedAFolder(),
    {
      type: VirtualDomElements.Button,
      className: `${ClassNames.Button} ${ClassNames.ButtonPrimary} ButtonWide`,
      childCount: 1,
      onClick: DomEventListenerFunctions.handleClickOpenFolder,
    },
    ExplorerStrings.openFolder(),
  ])
})

test('getExplorerWelcomeVirtualDom - narrow', () => {
  expect(GetExplorerWelcomeVirtualDom.getExplorerWelcomeVirtualDom(false)).toEqual([
    {
      type: VirtualDomElements.Div,
      className: `${ClassNames.Viewlet} ${ClassNames.Explorer}`,
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
    ExplorerStrings.youHaveNotYetOpenedAFolder(),
    {
      type: VirtualDomElements.Button,
      className: `${ClassNames.Button} ${ClassNames.ButtonPrimary} ButtonNarrow`,
      childCount: 1,
      onClick: DomEventListenerFunctions.handleClickOpenFolder,
    },
    ExplorerStrings.openFolder(),
  ])
})
