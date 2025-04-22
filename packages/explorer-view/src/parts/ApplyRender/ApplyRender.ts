import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DiffType from '../DiffType/DiffType.ts'
import * as GetRenderer from '../GetRenderer/GetRenderer.ts'

export const applyRender = (oldState: ExplorerState, newState: ExplorerState, diffResult: readonly number[]): readonly any[] => {
  const commands = []
  for (const item of diffResult) {
    if (item === DiffType.RenderSelection) {
      // TODO support this in the future
      continue
    }
    const fn = GetRenderer.getRenderer(item)
    const result = fn(oldState, newState)
    if (result.length > 0) {
      commands.push(result)
    }
  }
  return commands
}
