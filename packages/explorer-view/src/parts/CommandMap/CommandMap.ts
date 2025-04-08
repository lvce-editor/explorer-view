import * as AcceptEdit from '../AcceptEdit/AcceptEdit.ts'
import * as CancelEdit from '../CancelEdit/CancelEdit.ts'
import * as CollapseAll from '../CollapseAll/CollapseAll.ts'
import * as CopyPath from '../CopyPath/CopyPath.ts'
import * as CopyRelativePath from '../CopyRelativePath/CopyRelativePath.ts'
import * as Create from '../Create/Create.ts'
import * as Diff from '../Diff/Diff.ts'
import * as ExpandAll from '../ExpandAll/ExpandAll.ts'
import * as ExpandRecursively from '../ExpandRecursively/ExpandRecursively.ts'
import * as FocusFirst from '../FocusFirst/FocusFirst.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'
import * as FocusLast from '../FocusLast/FocusLast.ts'
import * as FocusNext from '../FocusNext/FocusNext.ts'
import * as FocusPrevious from '../FocusPrevious/FocusPrevious.ts'
import * as GetActions from '../GetActions/GetActions.ts'
import * as GetCommandIds from '../GetCommandIds/GetCommandIds.ts'
import * as GetExplorerVirtualDom from '../GetExplorerVirtualDom/GetExplorerVirtualDom.ts'
import * as GetKeyBindings from '../GetKeyBindings/GetKeyBindings.ts'
import * as GetMenuEntries from '../GetMenuEntries/GetMenuEntries.ts'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.ts'
import * as HandleArrowLeft from '../HandleArrowLeft/HandleArrowLeft.ts'
import * as HandleArrowRight from '../HandleArrowRight/HandleArrowRight.ts'
import * as HandleBlur from '../HandleBlur/HandleBlur.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleClickAt from '../HandleClickAt/HandleClickAt.ts'
import * as HandleClickCurrentButKeepFocus from '../HandleClickCurrentButKeepFocus/HandleClickCurrentButKeepFocus.ts'
import * as HandleClickOpenFolder from '../HandleClickOpenFolder/HandleClickOpenFolder.ts'
import * as HandleContextMenu from '../HandleContextMenu/HandleContextMenu.ts'
import * as HandleCopy from '../HandleCopy/HandleCopy.ts'
import * as HandleDragOver from '../HandleDragOver/HandleDragOver.ts'
import * as HandleDrop from '../HandleDrop/HandleDrop.ts'
import * as HandleFocus from '../HandleFocus/HandleFocus.ts'
import * as HandleIconThemeChange from '../HandleIconThemeChange/HandleIconThemeChange.ts'
import * as HandlePaste from '../HandlePaste/HandlePaste.ts'
import * as HandlePointerDown from '../HandlePointerDown/HandlePointerDown.ts'
import * as HandleUpload from '../HandleUpload/HandleUpload.ts'
import * as HandleWheel from '../HandleWheel/HandleWheel.ts'
import * as HandleWorkspaceChange from '../HandleWorkspaceChange/HandleWorkspaceChange.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import * as NewFile from '../NewFile/NewFile.ts'
import * as NewFolder from '../NewFolder/NewFolder.ts'
import * as OpenContainingFolder from '../OpenContainingFolder/OpenContainingFolder.ts'
import * as RemoveDirent from '../RemoveDirent/RemoveDirent.ts'
import * as RenameDirent from '../RenameDirent/RenameDirent.ts'
import * as Render2 from '../Render2/Render2.ts'
import * as Render from '../Render/Render.ts'
import * as RenderActions from '../RenderActions/RenderActions.ts'
import * as RenderEventListeners from '../RenderEventListeners/RenderEventListeners.ts'
import * as RestoreState from '../RestoreState/RestoreState.ts'
import * as RevealItem from '../RevealItem/RevealItem.ts'
import * as SaveState from '../SaveState/SaveState.ts'
import * as SetDeltaY from '../SetDeltaY/SetDeltaY.ts'
import * as Terminate from '../Terminate/Terminate.ts'
import * as UpdateEditingValue from '../UpdateEditingValue/UpdateEditingValue.ts'
import * as UpdateIcons from '../UpdateIcons/UpdateIcons.ts'
import * as WrapCommand from '../WrapCommand/WrapCommand.ts'

export const commandMap = {
  'Explorer.acceptEdit': WrapCommand.wrapCommand(AcceptEdit.acceptEdit),
  'Explorer.cancelEdit': WrapCommand.wrapCommand(CancelEdit.cancelEdit),
  'Explorer.collapseAll': WrapCommand.wrapCommand(CollapseAll.collapseAll),
  'Explorer.copyPath': WrapCommand.wrapCommand(CopyPath.copyPath),
  'Explorer.copyRelativePath': WrapCommand.wrapCommand(CopyRelativePath.copyRelativePath),
  'Explorer.expandAll': WrapCommand.wrapCommand(ExpandAll.expandAll),
  'Explorer.expandRecursively': WrapCommand.wrapCommand(ExpandRecursively.expandRecursively),
  'Explorer.focusFirst': WrapCommand.wrapCommand(FocusFirst.focusFirst),
  'Explorer.focusIndex': WrapCommand.wrapCommand(FocusIndex.focusIndex),
  'Explorer.focusLast': WrapCommand.wrapCommand(FocusLast.focusLast),
  'Explorer.focusNext': WrapCommand.wrapCommand(FocusNext.focusNext),
  'Explorer.focusPrevious': WrapCommand.wrapCommand(FocusPrevious.focusPrevious),
  'Explorer.getActions': WrapCommand.wrapCommand(GetActions.getActions),
  'Explorer.getCommandIds': GetCommandIds.getCommandIds,
  'Explorer.getKeyBindings': WrapCommand.wrapCommand(GetKeyBindings.getKeyBindings),
  'Explorer.getMenuEntries': WrapCommand.wrapCommand(GetMenuEntries.getMenuEntries),
  'Explorer.getVirtualDom': WrapCommand.wrapCommand(GetExplorerVirtualDom.getExplorerVirtualDom),
  'Explorer.getVisibleItems': WrapCommand.wrapCommand(GetVisibleExplorerItems.getVisibleExplorerItems),
  'Explorer.handleArrowLeft': WrapCommand.wrapCommand(HandleArrowLeft.handleArrowLeft),
  'Explorer.handleArrowRight': WrapCommand.wrapCommand(HandleArrowRight.handleArrowRight),
  'Explorer.handleBlur': WrapCommand.wrapCommand(HandleBlur.handleBlur),
  'Explorer.handleClick': WrapCommand.wrapCommand(HandleClick.handleClick),
  'Explorer.handleClickAt': WrapCommand.wrapCommand(HandleClickAt.handleClickAt),
  'Explorer.handleClickCurrentButKeepFocus': WrapCommand.wrapCommand(HandleClickCurrentButKeepFocus.handleClickCurrentButKeepFocus),
  'Explorer.handleClickOpenFolder': WrapCommand.wrapCommand(HandleClickOpenFolder.handleClickOpenFolder),
  'Explorer.handleContextMenu': WrapCommand.wrapCommand(HandleContextMenu.handleContextMenu),
  'Explorer.handleCopy': WrapCommand.wrapCommand(HandleCopy.handleCopy),
  'Explorer.handleDragOver': WrapCommand.wrapCommand(HandleDragOver.handleDragOver),
  'Explorer.handleDrop': WrapCommand.wrapCommand(HandleDrop.handleDrop),
  'Explorer.handleFocus': WrapCommand.wrapCommand(HandleFocus.handleFocus),
  'Explorer.handleIconThemeChange': WrapCommand.wrapCommand(HandleIconThemeChange.handleIconThemeChange),
  'Explorer.handlePaste': WrapCommand.wrapCommand(HandlePaste.handlePaste),
  'Explorer.handlePointerDown': WrapCommand.wrapCommand(HandlePointerDown.handlePointerDown),
  'Explorer.handleUpload': WrapCommand.wrapCommand(HandleUpload.handleUpload),
  'Explorer.handleWheel': WrapCommand.wrapCommand(HandleWheel.handleWheel),
  'Explorer.handleWorkspaceChange': WrapCommand.wrapCommand(HandleWorkspaceChange.handleWorkspaceChange),
  'Explorer.loadContent': WrapCommand.wrapCommand(LoadContent.loadContent),
  'Explorer.newFile': WrapCommand.wrapCommand(NewFile.newFile),
  'Explorer.newFolder': WrapCommand.wrapCommand(NewFolder.newFolder),
  'Explorer.openContainingFolder': WrapCommand.wrapCommand(OpenContainingFolder.openContainingFolder),
  'Explorer.removeDirent': WrapCommand.wrapCommand(RemoveDirent.removeDirent),
  'Explorer.renameDirent': WrapCommand.wrapCommand(RenameDirent.renameDirent),
  'Explorer.restoreState': WrapCommand.wrapCommand(RestoreState.restoreState),
  'Explorer.revealItem': WrapCommand.wrapCommand(RevealItem.revealItem),
  'Explorer.setDeltaY': WrapCommand.wrapCommand(SetDeltaY.setDeltaY),
  'Explorer.terminate': WrapCommand.wrapCommand(Terminate.terminate),
  'Explorer.updateEditingValue': WrapCommand.wrapCommand(UpdateEditingValue.updateEditingValue),
  'Explorer.updateIcons': WrapCommand.wrapCommand(UpdateIcons.updateIcons),

  'Explorer.render2': Render2.render2,

  // not wrapped
  'Explorer.create': Create.create,
  'Explorer.render': Render.doRender,
  'Explorer.renderActions': RenderActions.renderActions,
  'Explorer.saveState': SaveState.saveState,
  'Explorer.renderEventListeners': RenderEventListeners.renderEventListeners,
  'Explorer.diff': Diff.diff,
}
