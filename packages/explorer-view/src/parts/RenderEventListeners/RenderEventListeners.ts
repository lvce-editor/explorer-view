import { EventExpression } from '@lvce-editor/constants'
import type { DomEventListener } from '../DomEventListener/DomEventListener.ts'
import * as DomEventListenersFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const renderEventListeners = (): readonly DomEventListener[] => {
  return [
    {
      name: DomEventListenersFunctions.HandleInputBlur,
      params: ['handleInputBlur'],
    },
    // {
    //   name: DomEventListenersFunctions.HandleInputKeyDown,
    //   params: ['handleInputKeyDown'],
    //   stopPropagation: true, // TODO find a way to do this without stopPropagation
    // },
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
      params: [
        'handleClickAt',
        'event.defaultPrevented',
        EventExpression.Button,
        EventExpression.CtrlKey,
        'event.shiftKey',
        EventExpression.ClientX,
        EventExpression.ClientY,
      ],
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
      params: ['handlePointerDown', EventExpression.Button, EventExpression.ClientX, EventExpression.ClientY],
      // preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleEditingInput,
      params: ['updateEditingValue', EventExpression.TargetValue],
    },
    {
      name: DomEventListenersFunctions.HandleContextMenu,
      params: ['handleContextMenu', EventExpression.Button, EventExpression.ClientX, EventExpression.ClientY],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleWheel,
      params: ['handleWheel', EventExpression.DeltaMode, EventExpression.DeltaY],
      passive: true,
    },
    {
      name: DomEventListenersFunctions.HandleDragOver,
      params: ['handleDragOver', EventExpression.ClientX, EventExpression.ClientY],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleDrop,
      params: ['handleDrop', EventExpression.ClientX, EventExpression.ClientY, 'event.dataTransfer.files2', 'event.dataTransfer.files'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleDragLeave,
      params: ['handleDragLeave'],
    },
    {
      name: DomEventListenersFunctions.HandleDragStart,
      params: ['handleDragStart'],
      // @ts-ignore
      dragEffect: 'copyMove',
    },
  ]
}
