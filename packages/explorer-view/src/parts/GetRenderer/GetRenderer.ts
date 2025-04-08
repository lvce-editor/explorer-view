import type { Renderer } from '../Renderer/Renderer.ts'
import * as DiffType from '../DiffType/DiffType.ts'
import * as RenderEditingIndex from '../RenderEditingIndex/RenderEditingIndex.ts'
import * as RenderFocus from '../RenderFocus/RenderFocus.ts'
import * as RenderItems from '../RenderItems/RenderItems.ts'

export const getRenderer = (diffType: number): Renderer => {
  switch (diffType) {
    case DiffType.RenderEditingIndex:
      return RenderEditingIndex.renderEditingIndex
    case DiffType.RenderItems:
      return RenderItems.renderItems
    case DiffType.RenderFocus:
      return RenderFocus.renderFocus
    default:
      throw new Error('unknown renderer')
  }
}
