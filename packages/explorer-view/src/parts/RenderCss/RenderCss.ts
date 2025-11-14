import { ViewletCommand } from '@lvce-editor/constants'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getCss } from '../GetCss/GetCss.ts'
import { getUnique } from '../GetUnique/GetUnique.ts'

export const renderCss = (oldState: ExplorerState, newState: ExplorerState): readonly any[] => {
  const { scrollBarHeight, uid, visibleExplorerItems, errorMessageLeft, errorMessageTop } = newState
  const indents = visibleExplorerItems.map((item) => item.indent)
  const uniqueIndents = getUnique(indents)
  const css = getCss(scrollBarHeight, uniqueIndents, errorMessageLeft, errorMessageTop)
  return [ViewletCommand.SetCss, uid, css]
}
