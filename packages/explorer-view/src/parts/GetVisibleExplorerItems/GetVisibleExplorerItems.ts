import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'

export const getVisibleExplorerItems = (
  items: readonly any[],
  minLineY: number,
  maxLineY: number,
  focusedIndex: number,
  editingIndex: number,
  editingType: number,
  editingValue: string,
  icons: readonly any[],
): readonly any[] => {
  const visible = []
  let iconIndex = 0
  for (let i = minLineY; i < Math.min(maxLineY, items.length); i++) {
    const item = items[i]
    const icon = icons[iconIndex++]
    if (i === editingIndex) {
      visible.push({
        ...item,
        isFocused: i === focusedIndex,
        isEditing: true,
        icon,
      })
    } else {
      visible.push({
        ...item,
        isFocused: i === focusedIndex,
        icon,
      })
    }
  }
  if (editingType !== ExplorerEditingType.None && editingIndex === -1) {
    visible.push({
      depth: 3,
      posInSet: 1,
      setSize: 1,
      icon: '',
      isFocused: false,
      name: 'new',
      path: '/test/new',
      type: 2,
      isEditing: true,
    })
  }
  return visible
}
