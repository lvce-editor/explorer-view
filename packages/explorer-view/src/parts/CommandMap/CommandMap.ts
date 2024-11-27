import * as ExpandAll from '../ExpandAll/ExpandAll.ts'
import * as GetExplorerVirtualDom from '../GetExplorerVirtualDom/GetExplorerVirtualDom.ts'
import * as GetKeyBindings from '../GetKeyBindings/GetKeyBindings.ts'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'

export const commandMap = {
  'Explorer.cancelEdit': HandleClick.cancelEdit,
  'Explorer.copyPath': HandleClick.copyPath,
  'Explorer.copyRelativePath': HandleClick.copyRelativePath,
  'Explorer.expandAll': ExpandAll.expandAll,
  'Explorer.getKeyBindings': GetKeyBindings.getKeyBindings,
  'Explorer.getVirtualDom': GetExplorerVirtualDom.getExplorerVirtualDom,
  'Explorer.getVisibleItems': GetVisibleExplorerItems.getVisibleExplorerItems,
  'Explorer.handleArrowLeft': HandleClick.handleArrowLeft,
  'Explorer.handleArrowRight': HandleClick.handleArrowRight,
  'Explorer.handleBlur': HandleClick.handleBlur,
  'Explorer.handleClick': HandleClick.handleClick,
  'Explorer.handleClickAt': HandleClick.handleClickAt,
  'Explorer.handleClickCurrentButKeepFocus': HandleClick.handleClickCurrentButKeepFocus,
  'Explorer.handleClickOpenFolder': HandleClick.handleClickOpenFolder,
  'Explorer.handleIconThemeChange': HandleClick.handleIconThemeChange,
  'Explorer.handleWheel': HandleClick.handleWheel,
  'Explorer.loadContent': LoadContent.loadContent,
  'Explorer.removeDirent': HandleClick.removeDirent,
  'Explorer.renameDirent': HandleClick.renameDirent,
}
