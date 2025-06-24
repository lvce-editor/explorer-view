import { test, expect } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'
import { renderFocus } from '../src/parts/RenderFocusContext/RenderFocusContext.ts'
import * as WhenExpression from '../src/parts/WhenExpression/WhenExpression.ts'

const createMockState = (overrides: Partial<ExplorerState> = {}): ExplorerState => ({
  uid: 1,
  parentUid: 0,
  root: '/test',
  items: [],
  focusedIndex: 0,
  focused: false,
  hoverIndex: -1,
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  deltaY: 0,
  minLineY: 0,
  maxLineY: 100,
  pathSeparator: '/',
  version: 1,
  editingIndex: -1,
  itemHeight: 20,
  dropTargets: [],
  excluded: [],
  editingValue: '',
  editingType: 0,
  editingIcon: '',
  editingErrorMessage: '',
  editingSelectionStart: 0,
  editingSelectionEnd: 0,
  icons: [],
  useChevrons: false,
  fileIconCache: {} as any,
  platform: 1,
  focus: FocusId.None,
  inputSource: 1,
  focusWord: '',
  focusWordTimeout: 0,
  finalDeltaY: 0,
  scrollBarHeight: 0,
  handleOffset: 0,
  scrollBarActive: false,
  ...overrides,
})

test('should return FocusExplorerEditBox when focus is Input', () => {
  const oldState = createMockState()
  const newState = createMockState({ focus: FocusId.Input })

  const result = renderFocus(oldState, newState)

  expect(result).toEqual(['Viewlet.setFocusContext', WhenExpression.FocusExplorerEditBox])
})

test('should return FocusExplorer when focus is List', () => {
  const oldState = createMockState()
  const newState = createMockState({ focus: FocusId.List })

  const result = renderFocus(oldState, newState)

  expect(result).toEqual(['Viewlet.setFocusContext', WhenExpression.FocusExplorer])
})

test('should return empty array when focus is None', () => {
  const oldState = createMockState()
  const newState = createMockState({ focus: FocusId.None })

  const result = renderFocus(oldState, newState)

  expect(result).toEqual([])
})

test('should return empty array for unknown focus value', () => {
  const oldState = createMockState()
  const newState = createMockState({ focus: 999 })

  const result = renderFocus(oldState, newState)

  expect(result).toEqual([])
})
