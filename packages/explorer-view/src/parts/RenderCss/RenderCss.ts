import { ViewletCommand } from '@lvce-editor/constants'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const renderCss = (oldState: ExplorerState, newState: ExplorerState): readonly any[] => {
  const { scrollBarHeight, uid } = newState
  const css = `.Explorer {
  --ScrollBarThumbheight: ${scrollBarHeight}px;
}`
  return [ViewletCommand.SetCss, uid, css]
}
