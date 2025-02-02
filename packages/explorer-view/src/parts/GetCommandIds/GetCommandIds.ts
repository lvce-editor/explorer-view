
const commands = [
  'acceptEdit',
  'cancelEdit',
  'collapseAll',
  'copyPath',
  'copyRelativePath',
  'expandAll',
  'expandRecursively',
  'focus',
  'focusFirst',
  'focusIndex',
  'focusLast',
  'focusNext',
  'focusNone',
  'focusPrevious',
  'getFocusedDirent',
  'handleArrowLeft',
  'handleArrowLeft',
  'handleArrowRight',
  'handleArrowRight',
  'handleBlur',
  'handleClick',
  'handleClickAt',
  'handleClickCurrent',
  'handleClickCurrentButKeepFocus',
  'handleClickOpenFolder',
  'handleContextMenu',
  'handleCopy',
  'handleDragOver',
  'handleDrop',
  'handleFocus',
  'handleIconThemeChange',
  'handleLanguagesChanged',
  'handleMouseEnter',
  'handleMouseLeave',
  'handlePaste',
  'handlePointerDown',
  'handleUpload',
  'handleWheel',
  'handleWorkspaceChange',
  'hotReload',
  'newFile',
  'newFolder',
  'openContainingFolder',
  'refresh',
  'refresh',
  'relealItem',
  'removeDirent',
  'rename',
  'renameDirent',
  'revealItem',
  'scrollDown',
  'scrollUp',
  'setDeltaY',
  'updateEditingValue',
  'updateIcons',
]

export  const getCommandIds=():readonly string[] =>{
  return commands
}