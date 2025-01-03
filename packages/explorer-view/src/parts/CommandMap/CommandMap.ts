import * as AcceptEdit from '../AcceptEdit/AcceptEdit.ts'
import * as CancelEdit from '../CancelEdit/CancelEdit.ts'
import * as CollapseAll from '../CollapseAll/CollapseAll.ts'
import * as CopyPath from '../CopyPath/CopyPath.ts'
import * as CopyRelativePath from '../CopyRelativePath/CopyRelativePath.ts'
import * as ExpandAll from '../ExpandAll/ExpandAll.ts'
import * as ExpandRecursively from '../ExpandRecursively/ExpandRecursively.ts'
import * as FocusFirst from '../FocusFirst/FocusFirst.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'
import * as FocusLast from '../FocusLast/FocusLast.ts'
import * as FocusNext from '../FocusNext/FocusNext.ts'
import * as FocusPrevious from '../FocusPrevious/FocusPrevious.ts'
import * as GetActions from '../GetActions/GetActions.ts'
import * as GetExplorerVirtualDom from '../GetExplorerVirtualDom/GetExplorerVirtualDom.ts'
import * as GetKeyBindings from '../GetKeyBindings/GetKeyBindings.ts'
import * as GetMenuEntries from '../GetMenuEntries/GetMenuEntries.ts'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.ts'
import * as HandleBlur from '../HandleBlur/HandleBlur.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleClickOpenFolder from '../HandleClickOpenFolder/HandleClickOpenFolder.ts'
import * as HandleContextMenu from '../HandleContextMenu/HandleContextMenu.ts'
import * as HandleCopy from '../HandleCopy/HandleCopy.ts'
import * as HandleDragOver from '../HandleDragOver/HandleDragOver.ts'
import * as HandleDrop from '../HandleDrop/HandleDrop.ts'
import * as HandleIconThemeChange from '../HandleIconThemeChange/HandleIconThemeChange.ts'
import * as HandlePaste from '../HandlePaste/HandlePaste.ts'
import * as HandlePointerDown from '../HandlePointerDown/HandlePointerDown.ts'
import * as HandleUpload from '../HandleUpload/HandleUpload.ts'
import * as HandleWorkspaceChange from '../HandleWorkspaceChange/HandleWorkspaceChange.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import * as NewFile from '../NewFile/NewFile.ts'
import * as NewFolder from '../NewFolder/NewFolder.ts'
import * as OpenContainingFolder from '../OpenContainingFolder/OpenContainingFolder.ts'
import * as RemoveDirent from '../RemoveDirent/RemoveDirent.ts'
import * as RenameDirent from '../RenameDirent/RenameDirent.ts'
import * as Render from '../Render/Render.ts'
import * as RenderActions from '../RenderActions/RenderActions.ts'
import * as RestoreState from '../RestoreState/RestoreState.ts'
import * as RevealItem from '../RevealItem/RevealItem.ts'
import * as SaveState from '../SaveState/SaveState.ts'
import * as SetDeltaY from '../SetDeltaY/SetDeltaY.ts'
import * as UpdateEditingValue from '../UpdateEditingValue/UpdateEditingValue.ts'
import * as UpdateIcons from '../UpdateIcons/UpdateIcons.ts'

export const commandMap = {
  'Explorer.acceptEdit': AcceptEdit.acceptEdit,
  'Explorer.cancelEdit': CancelEdit.cancelEdit,
  'Explorer.collapseAll': CollapseAll.collapseAll,
  'Explorer.copyPath': CopyPath.copyPath,
  'Explorer.copyRelativePath': CopyRelativePath.copyRelativePath,
  'Explorer.expandAll': ExpandAll.expandAll,
  'Explorer.expandRecursively': ExpandRecursively.expandRecursively,
  'Explorer.focusFirst': FocusFirst.focusFirst,
  'Explorer.focusIndex': FocusIndex.focusIndex,
  'Explorer.focusLast': FocusLast.focusLast,
  'Explorer.focusNext': FocusNext.focusNext,
  'Explorer.focusPrevious': FocusPrevious.focusPrevious,
  'Explorer.getActions': GetActions.getActions,
  'Explorer.getKeyBindings': GetKeyBindings.getKeyBindings,
  'Explorer.getMenuEntries': GetMenuEntries.getMenuEntries,
  'Explorer.getVirtualDom': GetExplorerVirtualDom.getExplorerVirtualDom,
  'Explorer.getVisibleItems': GetVisibleExplorerItems.getVisibleExplorerItems,
  'Explorer.handleArrowLeft': HandleClick.handleArrowLeft,
  'Explorer.handleArrowRight': HandleClick.handleArrowRight,
  'Explorer.handleBlur': HandleBlur.handleBlur,
  'Explorer.handleClick': HandleClick.handleClick,
  'Explorer.handleClickAt': HandleClick.handleClickAt,
  'Explorer.handleClickCurrentButKeepFocus': HandleClick.handleClickCurrentButKeepFocus,
  'Explorer.handleClickOpenFolder': HandleClickOpenFolder.handleClickOpenFolder,
  'Explorer.handleContextMenu': HandleContextMenu.handleContextMenu,
  'Explorer.handleCopy': HandleCopy.handleCopy,
  'Explorer.handleDragOver': HandleDragOver.handleDragOver,
  'Explorer.handleDrop': HandleDrop.handleDrop,
  'Explorer.handleIconThemeChange': HandleIconThemeChange.handleIconThemeChange,
  'Explorer.handlePaste': HandlePaste.handlePaste,
  'Explorer.handlePointerDown': HandlePointerDown.handlePointerDown,
  'Explorer.handleUpload': HandleUpload.handleUpload,
  'Explorer.handleWheel': HandleClick.handleWheel,
  'Explorer.handleWorkspaceChange': HandleWorkspaceChange.handleWorkspaceChange,
  'Explorer.loadContent': LoadContent.loadContent,
  'Explorer.newFile': NewFile.newFile,
  'Explorer.newFolder': NewFolder.newFolder,
  'Explorer.openContainingFolder': OpenContainingFolder.openContainingFolder,
  'Explorer.removeDirent': RemoveDirent.removeDirent,
  'Explorer.renameDirent': RenameDirent.renameDirent,
  'Explorer.render': Render.doRender,
  'Explorer.renderActions': RenderActions.renderActions,
  'Explorer.restoreState': RestoreState.restoreState,
  'Explorer.revealItem': RevealItem.revealItem,
  'Explorer.saveState': SaveState.saveState,
  'Explorer.setDeltaY': SetDeltaY.setDeltaY,
  'Explorer.updateEditingValue': UpdateEditingValue.updateEditingValue,
  'Explorer.updateIcons': UpdateIcons.updateIcons,
}
