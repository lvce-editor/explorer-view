import type { Renderer } from '../Renderer/Renderer.ts'
import * as DiffType from '../DiffType/DiffType.ts'
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
      return RenderFocusContext.renderFocus
    case DiffType.RenderValue:
      return RenderValue.renderValue
    case DiffType.RenderSelection:
      return RenderEditingSelection.renderEditingSelection
    case DiffType.RenderDragData:
      return RenderDragData.renderDragData
    default:
      throw new Error('unknown renderer')
  }
}
