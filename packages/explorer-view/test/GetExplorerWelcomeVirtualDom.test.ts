import { expect, test } from '@jest/globals'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { dropTargetFull } from '../src/parts/DropTargetFull/DropTargetFull.ts'
import * as GetExplorerWelcomeVirtualDom from '../src/parts/GetExplorerWelcomeVirtualDom/GetExplorerWelcomeVirtualDom.ts'
import * as TabIndex from '../src/parts/TabIndex/TabIndex.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getExplorerWelcomeVirtualDom - wide', () => {
  expect(GetExplorerWelcomeVirtualDom.getExplorerWelcomeVirtualDom(true, [])).toEqual([
    {
      childCount: 1,
      className: 'Viewlet Explorer',
      onContextMenu: DomEventListenerFunctions.HandleContextMenuWelcome,
      onDragLeave: DomEventListenerFunctions.HandleDragLeave,
      onDragOver: DomEventListenerFunctions.HandleDragOver,
      onDrop: DomEventListenerFunctions.HandleDrop,
      tabIndex: TabIndex.Focusable,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: 'Welcome',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'WelcomeMessage',
      type: VirtualDomElements.P,
    },
    {
      childCount: 0,
      text: 'You have not yet opened a folder.',
      type: VirtualDomElements.Text,
    },
    {
      childCount: 1,
      className: 'Button ButtonPrimary ButtonWide',
      name: 'OpenFolder',
      onClick: DomEventListenerFunctions.HandleClickOpenFolder,
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      text: 'Open folder',
      type: VirtualDomElements.Text,
    },
  ])
})

test('getExplorerWelcomeVirtualDom - narrow', () => {
  expect(GetExplorerWelcomeVirtualDom.getExplorerWelcomeVirtualDom(false, [])).toEqual([
    {
      childCount: 1,
      className: 'Viewlet Explorer',
      onContextMenu: DomEventListenerFunctions.HandleContextMenuWelcome,
      onDragLeave: DomEventListenerFunctions.HandleDragLeave,
      onDragOver: DomEventListenerFunctions.HandleDragOver,
      onDrop: DomEventListenerFunctions.HandleDrop,
      tabIndex: TabIndex.Focusable,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: 'Welcome',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'WelcomeMessage',
      type: VirtualDomElements.P,
    },
    {
      childCount: 0,
      text: 'You have not yet opened a folder.',
      type: VirtualDomElements.Text,
    },
    {
      childCount: 1,
      className: 'Button ButtonPrimary ButtonNarrow',
      name: 'OpenFolder',
      onClick: DomEventListenerFunctions.HandleClickOpenFolder,
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      text: 'Open folder',
      type: VirtualDomElements.Text,
    },
  ])
})

test('getExplorerWelcomeVirtualDom - drop target', () => {
  expect(GetExplorerWelcomeVirtualDom.getExplorerWelcomeVirtualDom(true, dropTargetFull)).toEqual([
    {
      childCount: 1,
      className: 'Viewlet Explorer DropTarget',
      onContextMenu: DomEventListenerFunctions.HandleContextMenuWelcome,
      onDragLeave: DomEventListenerFunctions.HandleDragLeave,
      onDragOver: DomEventListenerFunctions.HandleDragOver,
      onDrop: DomEventListenerFunctions.HandleDrop,
      tabIndex: TabIndex.Focusable,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: 'Welcome',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'WelcomeMessage',
      type: VirtualDomElements.P,
    },
    {
      childCount: 0,
      text: 'You have not yet opened a folder.',
      type: VirtualDomElements.Text,
    },
    {
      childCount: 1,
      className: 'Button ButtonPrimary ButtonWide',
      name: 'OpenFolder',
      onClick: DomEventListenerFunctions.HandleClickOpenFolder,
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      text: 'Open folder',
      type: VirtualDomElements.Text,
    },
  ])
})
