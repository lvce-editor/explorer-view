import type { DomEventListener } from '../DomEventListener/DomEventListener.ts'
import * as DomEventListenersFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const renderEventListeners = (): readonly DomEventListener[] => {
  return [
    {
      name: DomEventListenersFunctions.HandleBlur,
      params: ['handleBlur'],
    },
    {
      name: DomEventListenersFunctions.HandleFocus,
      params: ['handleFocus', 'event.isTrusted', 'event.target.className'],
    },
    {
      name: DomEventListenersFunctions.HandleBlur,
      params: ['handleBlur'],
    },
    {
      name: DomEventListenersFunctions.HandleClick,
      params: ['event.button', 'event.clientX', 'event.clientY'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleClickOpenFolder,
      params: [],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandlePointerDown,
      params: ['event.button', 'event.clientX', 'event.clientY'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleEditingInput,
      params: ['event.target.value'],
    },
    {
      name: DomEventListenersFunctions.HandleContextMenu,
      params: ['event.button', 'event.clientX', 'event.clientY'],
    },
    {
      name: DomEventListenersFunctions.HandleWheel,
      params: ['event.deltaMode', 'event.deltaY'],
      passive: true,
    },
  ]
}
