import { ViewletCommand } from '@lvce-editor/constants'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getCss } from '../GetCss/GetCss.ts'
import * as GetErrorMessagePosition from '../GetErrorMessagePosition/GetErrorMessagePosition.ts'
import { getUnique } from '../GetUnique/GetUnique.ts'

export const renderCss = (oldState: ExplorerState, newState: ExplorerState): readonly any[] => {
  const { focusedIndex, itemHeight, items, minLineY, scrollBarHeight, uid, visibleExplorerItems, width } = newState
  const indents = visibleExplorerItems.map((item) => item.indent)
  const uniqueIndents = getUnique(indents)
  const indent = 8
  const padding = 10
  const fileIconWidth = 16
  const defaultPaddingLeft = 0
  const chevronSpace = 22
  const depth = items[focusedIndex]?.depth || 0
  const { errorMessageWidth, left, top } = GetErrorMessagePosition.getErrorMessagePosition(
    itemHeight,
    focusedIndex,
    minLineY,
    depth,
    indent,
    fileIconWidth,
    padding + defaultPaddingLeft + chevronSpace,
    width,
  )
  const css = getCss(scrollBarHeight, uniqueIndents, left, top, errorMessageWidth)
  return [ViewletCommand.SetCss, uid, css]
}
