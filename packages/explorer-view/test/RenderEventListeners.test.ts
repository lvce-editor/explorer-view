import { expect, test } from '@jest/globals'
import * as DomEventListenersFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as RenderEventListeners from '../src/parts/RenderEventListeners/RenderEventListeners.ts'

test('renderEventListeners', () => {
  const eventListeners = RenderEventListeners.renderEventListeners()
  expect(eventListeners).toEqual([
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
  ])
})
