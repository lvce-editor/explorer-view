import { ViewletCommand } from '@lvce-editor/constants'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getTreeItemIndent } from '../GetTreeItemIndent/GetTreeItemIndent.ts'

export const renderCss = (oldState: ExplorerState, newState: ExplorerState): readonly any[] => {
  const { scrollBarHeight, uid, maxIndent } = newState
  const rules = [
    `.Explorer {
  --ScrollBarThumbHeight: ${scrollBarHeight}px;
`,
  ]
  for (let i = 0; i < maxIndent; i++) {
    const indent = getTreeItemIndent(i)
    rules.push(`.Indent-${i} {
  padding-left: ${indent}px;
}`)
  }
  const css = rules.join('\n')
  return [ViewletCommand.SetCss, uid, css]
}
