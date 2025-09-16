import type { Renderer } from '../Renderer/Renderer.ts'
import * as DiffType from '../DiffType/DiffType.ts'
import { renderCss } from '../RenderCss/RenderCss.ts'
import * as RenderDragData from '../RenderDragData/RenderDragData.ts'
import * as RenderEditingSelection from '../RenderEditingSelection/RenderEditingSelection.ts'
import * as RenderFocus from '../RenderFocus/RenderFocus.ts'
import * as RenderFocusContext from '../RenderFocusContext/RenderFocusContext.ts'
import * as RenderItems from '../RenderItems/RenderItems.ts'
import * as RenderValue from '../RenderValue/RenderValue.ts'

export const getRenderer = (diffType: number): Renderer => {
  switch (diffType) {
    case DiffType.RenderItems:
      return RenderItems.renderItems
    case DiffType.RenderFocus:
      return RenderFocus.renderFocus
    case DiffType.RenderFocusContext:
      return RenderFocusContext.renderFocusContext
    case DiffType.RenderValue:
      return RenderValue.renderValue
    case DiffType.RenderSelection:
      return RenderEditingSelection.renderEditingSelection
    case DiffType.RenderDragData:
      return RenderDragData.renderDragData
    case DiffType.RenderCss:
      return renderCss
    default:
      throw new Error('unknown renderer')
  }
}
