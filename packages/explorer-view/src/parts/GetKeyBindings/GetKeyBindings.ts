import * as KeyCode from '../KeyCode/KeyCode.ts'
import * as KeyModifier from '../KeyModifier/KeyModifier.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'

export const getKeyBindings = (): readonly any[] => {
  return [
    {
      key: KeyCode.RightArrow,
      command: 'Explorer.handleArrowRight',
      when: WhenExpression.FocusExplorer,
    },
    {
      key: KeyCode.LeftArrow,
      command: 'Explorer.handleArrowLeft',
      when: WhenExpression.FocusExplorer,
    },
    {
      key: KeyCode.Home,
      command: 'Explorer.focusFirst',
      when: WhenExpression.FocusExplorer,
    },
    {
      key: KeyCode.End,
      command: 'Explorer.focusLast',
      when: WhenExpression.FocusExplorer,
    },
    {
      key: KeyCode.UpArrow,
      command: 'Explorer.focusPrevious',
      when: WhenExpression.FocusExplorer,
    },
    {
      key: KeyCode.DownArrow,
      command: 'Explorer.focusNext',
      when: WhenExpression.FocusExplorer,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Star,
      command: 'Explorer.expandAll',
      when: WhenExpression.FocusExplorer,
    },
    {
      key: KeyModifier.Alt | KeyCode.RightArrow,
      command: 'Explorer.expandRecursively',
      when: WhenExpression.FocusExplorer,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.LeftArrow,
      command: 'Explorer.collapseAll',
      when: WhenExpression.FocusExplorer,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyV,
      command: 'Explorer.handlePaste',
      when: WhenExpression.FocusExplorer,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyC,
      command: 'Explorer.handleCopy',
      when: WhenExpression.FocusExplorer,
    },
    {
      key: KeyCode.F2,
      command: 'Explorer.rename',
      when: WhenExpression.FocusExplorer,
    },
    {
      key: KeyCode.Escape,
      command: 'Explorer.cancelEdit',
      when: WhenExpression.FocusExplorerEditBox,
    },
    {
      key: KeyCode.Enter,
      command: 'Explorer.acceptEdit',
      when: WhenExpression.FocusExplorerEditBox,
    },
    {
      key: KeyCode.Delete,
      command: 'Explorer.removeDirent',
      when: WhenExpression.FocusExplorer,
    },
    {
      key: KeyCode.Escape,
      command: 'Explorer.focusNone',
      when: WhenExpression.FocusExplorer,
    },
    {
      key: KeyCode.Space,
      command: 'Explorer.handleClickCurrentButKeepFocus',
      when: WhenExpression.FocusExplorer,
    },
    {
      key: KeyCode.Enter,
      command: 'Explorer.handleClickCurrent',
      when: WhenExpression.FocusExplorer,
    },
  ]
}
