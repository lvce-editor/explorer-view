import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as UpdateIcons from '../UpdateIcons/UpdateIcons.ts'

export const handleIconThemeChange = (state: ExplorerState): ExplorerState => {
  return UpdateIcons.updateIcons(state)
}
