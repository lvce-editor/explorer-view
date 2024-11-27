import * as GetKeyBindings from '../GetKeyBindings/GetKeyBindings.ts'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.ts'

export const commandMap = {
  'Explorer.getKeyBindings': GetKeyBindings.getKeyBindings,
  'Explorer.getVisibleItems': GetVisibleExplorerItems.getVisibleExplorerItems,
}
