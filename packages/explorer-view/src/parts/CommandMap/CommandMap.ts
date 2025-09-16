import { terminate } from '@lvce-editor/viewlet-registry'
import * as AcceptEdit from '../AcceptEdit/AcceptEdit.ts'
import * as CancelEdit from '../CancelEdit/CancelEdit.ts'
import * as CancelTypeAhead from '../CancelTypeAhead/CancelTypeAhead.ts'
import * as CollapseAll from '../CollapseAll/CollapseAll.ts'
import * as CopyPath from '../CopyPath/CopyPath.ts'
import * as CopyRelativePath from '../CopyRelativePath/CopyRelativePath.ts'
import * as Create2 from '../Create2/Create2.ts'
import * as Create from '../Create/Create.ts'
import * as Diff2 from '../Diff2/Diff2.ts'
import * as ExpandAll from '../ExpandAll/ExpandAll.ts'
import * as ExpandRecursively from '../ExpandRecursively/ExpandRecursively.ts'
import * as WrapCommand from '../ExplorerStates/ExplorerStates.ts'
import * as Focus from '../Focus/Focus.ts'
import * as FocusFirst from '../FocusFirst/FocusFirst.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'
import * as FocusLast from '../FocusLast/FocusLast.ts'
import * as FocusNext from '../FocusNext/FocusNext.ts'
import * as FocusNone from '../FocusNone/FocusNone.ts'
import * as FocusPrevious from '../FocusPrevious/FocusPrevious.ts'
import * as GetKeyBindings from '../GetKeyBindings/GetKeyBindings.ts'
import * as GetMenuEntries2 from '../GetMenuEntries2/GetMenuEntries2.ts'
import * as GetMenuEntries from '../GetMenuEntries/GetMenuEntries.ts'
import * as GetMouseActions from '../GetMouseActions/GetMouseActions.ts'
import * as HandleArrowLeft from '../HandleArrowLeft/HandleArrowLeft.ts'
import * as HandleArrowRight from '../HandleArrowRight/HandleArrowRight.ts'
import * as HandleBlur from '../HandleBlur/HandleBlur.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleClickAt from '../HandleClickAt/HandleClickAt.ts'
import * as HandleClickCurrent from '../HandleClickCurrent/HandleClickCurrent.ts'
import * as HandleClickCurrentButKeepFocus from '../HandleClickCurrentButKeepFocus/HandleClickCurrentButKeepFocus.ts'
import * as HandleClickOpenFolder from '../HandleClickOpenFolder/HandleClickOpenFolder.ts'
import * as HandleContextMenu from '../HandleContextMenu/HandleContextMenu.ts'
import * as HandleContextMenuKeyboard from '../HandleContextMenuKeyboard/HandleContextMenuKeyboard.ts'
import * as HandleCopy from '../HandleCopy/HandleCopy.ts'
import * as HandleCut from '../HandleCut/HandleCut.ts'
import * as HandleDragLeave from '../HandleDragLeave/HandleDragLeave.ts'
import * as HandleDragOver from '../HandleDragOver/HandleDragOver.ts'
import * as HandleDragOverIndex from '../HandleDragOverIndex/HandleDragOverIndex.ts'
import * as HandleDragStart from '../HandleDragStart/HandleDragStart.ts'
import * as HandleDrop from '../HandleDrop/HandleDrop.ts'
import { handleEscape } from '../HandleEscape/HandleEscape.ts'
import * as HandleFocus from '../HandleFocus/HandleFocus.ts'
import * as HandleIconThemeChange from '../HandleIconThemeChange/HandleIconThemeChange.ts'
import * as HandleInputBlur from '../HandleInputBlur/HandleInputBlur.ts'
import * as HandleInputClick from '../HandleInputClick/HandleInputClick.ts'
import * as HandleInputKeyDown from '../HandleInputKeyDown/HandleInputKeyDown.ts'
import * as HandleKeyDown from '../HandleKeyDown/HandleKeyDown.ts'
import * as HandlePaste from '../HandlePaste/HandlePaste.ts'
import * as HandlePointerDown from '../HandlePointerDown/HandlePointerDown.ts'
import * as HandleUpload from '../HandleUpload/HandleUpload.ts'
import * as HandleWheel from '../HandleWheel/HandleWheel.ts'
import * as HandleWorkspaceChange from '../HandleWorkspaceChange/HandleWorkspaceChange.ts'
import * as Initialize from '../Initialize/Initialize.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import * as NewFile from '../NewFile/NewFile.ts'
import * as NewFolder from '../NewFolder/NewFolder.ts'
import * as OpenContainingFolder from '../OpenContainingFolder/OpenContainingFolder.ts'
import * as Refresh from '../Refresh/Refresh.ts'
import * as RemoveDirent from '../RemoveDirent/RemoveDirent.ts'
import * as RenameDirent from '../RenameDirent/RenameDirent.ts'
import * as Render2 from '../Render2/Render2.ts'
import * as RenderActions2 from '../RenderActions2/RenderActions2.ts'
import * as RenderEventListeners from '../RenderEventListeners/RenderEventListeners.ts'
import * as RestoreState from '../RestoreState/RestoreState.ts'
import * as RevealItem from '../RevealItem/RevealItem.ts'
import * as SaveState from '../SaveState/SaveState.ts'
import * as SelectAll from '../SelectAll/SelectAll.ts'
import * as SelectDown from '../SelectDown/SelectDown.ts'
import * as SelectIndices from '../SelectIndices/SelectIndices.ts'
import * as SelectUp from '../SelectUp/SelectUp.ts'
import * as SetDeltaY from '../SetDeltaY/SetDeltaY.ts'
import * as ToggleIndividualSelection from '../ToggleIndividualSelection/ToggleIndividualSelection.ts'
import * as UpdateEditingValue from '../UpdateEditingValue/UpdateEditingValue.ts'
import * as UpdateIcons from '../UpdateIcons/UpdateIcons.ts'

export const commandMap = {
  'Explorer.acceptEdit': WrapCommand.wrapListItemCommand(AcceptEdit.acceptEdit),
  'Explorer.cancelEdit': WrapCommand.wrapListItemCommand(CancelEdit.cancelEdit),
  'Explorer.cancelTypeAhead': WrapCommand.wrapCommand(CancelTypeAhead.cancelTypeAhead),
  'Explorer.collapseAll': WrapCommand.wrapListItemCommand(CollapseAll.collapseAll),
  'Explorer.copyPath': WrapCommand.wrapCommand(CopyPath.copyPath),
  'Explorer.copyRelativePath': WrapCommand.wrapCommand(CopyRelativePath.copyRelativePath),
  'Explorer.expandAll': WrapCommand.wrapListItemCommand(ExpandAll.expandAll),
  'Explorer.expandRecursively': WrapCommand.wrapListItemCommand(ExpandRecursively.expandRecursively),
  'Explorer.focus': WrapCommand.wrapCommand(Focus.focus),
  'Explorer.focusFirst': WrapCommand.wrapCommand(FocusFirst.focusFirst),
  'Explorer.focusIndex': WrapCommand.wrapCommand(FocusIndex.focusIndex),
  'Explorer.focusLast': WrapCommand.wrapCommand(FocusLast.focusLast),
  'Explorer.handleDragStart': WrapCommand.wrapCommand(HandleDragStart.handleDragStart),
  'Explorer.handleDragOverIndex': WrapCommand.wrapCommand(HandleDragOverIndex.handleDragOverIndex),
  'Explorer.focusNext': WrapCommand.wrapCommand(FocusNext.focusNext),
  'Explorer.focusNone': WrapCommand.wrapCommand(FocusNone.focusNone),
  'Explorer.focusPrevious': WrapCommand.wrapCommand(FocusPrevious.focusPrevious),
  'Explorer.getCommandIds': WrapCommand.getCommandIds,
  'Explorer.getMenuEntries2': GetMenuEntries2.getMenuEntries2,
  'Explorer.getMouseActions': GetMouseActions.getMouseActions,
  'Explorer.handleArrowLeft': WrapCommand.wrapCommand(HandleArrowLeft.handleArrowLeft),
  'Explorer.handleArrowRight': WrapCommand.wrapCommand(HandleArrowRight.handleArrowRight),
  'Explorer.handleEscape': WrapCommand.wrapCommand(handleEscape),
  'Explorer.handleBlur': WrapCommand.wrapCommand(HandleBlur.handleBlur),
  'Explorer.handleClick': WrapCommand.wrapListItemCommand(HandleClick.handleClick),
  'Explorer.handleClickAt': WrapCommand.wrapCommand(HandleClickAt.handleClickAt),
  'Explorer.handleClickCurrent': WrapCommand.wrapCommand(HandleClickCurrent.handleClickCurrent),
  'Explorer.handleClickCurrentButKeepFocus': WrapCommand.wrapCommand(HandleClickCurrentButKeepFocus.handleClickCurrentButKeepFocus),
  'Explorer.handleClickOpenFolder': WrapCommand.wrapCommand(HandleClickOpenFolder.handleClickOpenFolder),
  'Explorer.handleContextMenu': WrapCommand.wrapCommand(HandleContextMenu.handleContextMenu),
  'Explorer.handleContextMenuKeyboard': WrapCommand.wrapCommand(HandleContextMenuKeyboard.handleContextMenuKeyboard),
  'Explorer.handleCopy': WrapCommand.wrapCommand(HandleCopy.handleCopy),
  'Explorer.handleCut': WrapCommand.wrapCommand(HandleCut.handleCut),
  'Explorer.handleDragLeave': WrapCommand.wrapCommand(HandleDragLeave.handleDragLeave),
  'Explorer.handleDragOver': WrapCommand.wrapCommand(HandleDragOver.handleDragOver),
  'Explorer.handleDrop': WrapCommand.wrapCommand(HandleDrop.handleDrop),
  'Explorer.handleFocus': WrapCommand.wrapCommand(HandleFocus.handleFocus),
  'Explorer.handleIconThemeChange': WrapCommand.wrapCommand(HandleIconThemeChange.handleIconThemeChange),
  'Explorer.handleInputBlur': WrapCommand.wrapCommand(HandleInputBlur.handleInputBlur),
  'Explorer.handleInputClick': WrapCommand.wrapCommand(HandleInputClick.handleInputClick),
  'Explorer.handleInputKeyDown': WrapCommand.wrapCommand(HandleInputKeyDown.handleInputKeyDown),
  'Explorer.handleKeyDown': WrapCommand.wrapCommand(HandleKeyDown.handleKeyDown),
  'Explorer.handlePaste': WrapCommand.wrapListItemCommand(HandlePaste.handlePaste),
  'Explorer.handlePointerDown': WrapCommand.wrapCommand(HandlePointerDown.handlePointerDown),
  'Explorer.handleUpload': WrapCommand.wrapCommand(HandleUpload.handleUpload),
  'Explorer.handleWheel': WrapCommand.wrapCommand(HandleWheel.handleWheel),
  'Explorer.handleWorkspaceChange': WrapCommand.wrapCommand(HandleWorkspaceChange.handleWorkspaceChange),
  'Explorer.loadContent': WrapCommand.wrapCommand(LoadContent.loadContent),
  'Explorer.newFile': WrapCommand.wrapListItemCommand(NewFile.newFile),
  'Explorer.newFolder': WrapCommand.wrapListItemCommand(NewFolder.newFolder),
  'Explorer.openContainingFolder': WrapCommand.wrapCommand(OpenContainingFolder.openContainingFolder),
  'Explorer.refresh': WrapCommand.wrapListItemCommand(Refresh.refresh),
  'Explorer.removeDirent': WrapCommand.wrapListItemCommand(RemoveDirent.removeDirent),
  'Explorer.renameDirent': WrapCommand.wrapListItemCommand(RenameDirent.renameDirent),
  'Explorer.restoreState': RestoreState.restoreState,
  'Explorer.revealItem': WrapCommand.wrapCommand(RevealItem.revealItem),
  'Explorer.selectAll': WrapCommand.wrapCommand(SelectAll.selectAll),
  'Explorer.selectDown': WrapCommand.wrapCommand(SelectDown.selectDown),
  'Explorer.selectIndices': WrapCommand.wrapCommand(SelectIndices.setSelectedIndices),
  'Explorer.selectUp': WrapCommand.wrapCommand(SelectUp.selectUp),
  'Explorer.setDeltaY': WrapCommand.wrapListItemCommand(SetDeltaY.setDeltaY),
  'Explorer.setSelectedIndices': WrapCommand.wrapCommand(SelectIndices.setSelectedIndices),
  'Explorer.toggleIndividualSelection': WrapCommand.wrapCommand(ToggleIndividualSelection.toggleIndividualSelection),
  'Explorer.updateEditingValue': WrapCommand.wrapCommand(UpdateEditingValue.updateEditingValue),
  'Explorer.updateIcons': WrapCommand.wrapCommand(UpdateIcons.updateIcons),

  // not wrapped
  'Explorer.create2': Create2.create2,
  'Explorer.diff2': Diff2.diff2,
  'Explorer.getKeyBindings': GetKeyBindings.getKeyBindings,
  'Explorer.getMenuEntries': GetMenuEntries.getMenuEntries,
  'Explorer.render2': Render2.render2,
  'Explorer.renderActions2': RenderActions2.renderActions,
  'Explorer.renderEventListeners': RenderEventListeners.renderEventListeners,
  'Explorer.saveState': WrapCommand.wrapGetter(SaveState.saveState),
  'Explorer.terminate': terminate,
  'Explorer.initialize': Initialize.initialize,

  // deprecated
  'Explorer.create': Create.create,
}
