import { expect, test } from '@jest/globals'
import * as DomEventListenersFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as RenderEventListeners from '../src/parts/RenderEventListeners/RenderEventListeners.ts'

test('renderEventListeners', () => {
  const eventListeners = RenderEventListeners.renderEventListeners()
  expect(eventListeners).toEqual([
    {
      name: DomEventListenersFunctions.HandleInputBlur,
      params: ['handleInputBlur'],
    },
    // {
    //   name: DomEventListenersFunctions.HandleListKeyDown,
    //   params: ['handleKeyDown', 'event.key'],
    //   preventDefault: true,
    // },
    {
      name: DomEventListenersFunctions.HandleListFocus,
      params: ['handleFocus', 'event.isTrusted', 'event.target.className'],
    },
    {
      name: DomEventListenersFunctions.HandleListBlur,
      params: ['handleBlur'],
    },
    {
      name: DomEventListenersFunctions.HandleClick,
      params: ['handleClickAt', 'event.defaultPrevented', 'event.button', 'event.ctrlKey', 'event.shiftKey', 'event.clientX', 'event.clientY'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleInputClick,
      params: ['handleInputClick'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleClickOpenFolder,
      params: ['handleClickOpenFolder'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandlePointerDown,
      params: ['handlePointerDown', 'event.button', 'event.clientX', 'event.clientY'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleEditingInput,
      params: ['updateEditingValue', 'event.target.value'],
    },
    {
      name: DomEventListenersFunctions.HandleContextMenu,
      params: ['handleContextMenu', 'event.button', 'event.clientX', 'event.clientY'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleWheel,
      params: ['handleWheel', 'event.deltaMode', 'event.deltaY'],
      passive: true,
    },
    {
      name: DomEventListenersFunctions.HandleDragOver,
      params: ['handleDragOver', 'event.clientX', 'event.clientY'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleDrop,
      params: ['handleDrop', 'event.clientX', 'event.clientY', 'event.dataTransfer.files2', 'event.dataTransfer.files'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleDragLeave,
      params: ['handleDragLeave'],
    },
  ])
})
