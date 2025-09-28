import { ViewletCommand } from '@lvce-editor/constants'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getTreeItemIndent } from '../GetTreeItemIndent/GetTreeItemIndent.ts'

const getCss = (scrollBarHeight: number, maxIndent: number): string => {
  const rules = [
    `.Explorer {
  --ScrollBarThumbHeight: ${scrollBarHeight}px;
`,
  ]
  for (let i = 0; i < maxIndent; i++) {
    const indent = getTreeItemIndent(i)
    rules.push(`.Indent-${i} {
  padding-left: ${indent};
}`)
  }
  const css = rules.join('\n')
  return css
}

export const renderCss = (oldState: ExplorerState, newState: ExplorerState): readonly any[] => {
  const { scrollBarHeight, uid, maxIndent } = newState
  const css = getCss(scrollBarHeight, maxIndent)
  return [ViewletCommand.SetCss, uid, css]
}
