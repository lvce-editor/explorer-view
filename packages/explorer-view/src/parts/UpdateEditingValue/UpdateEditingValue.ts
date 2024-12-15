import * as IconTheme from '../IconTheme/IconTheme.ts'

export const updateEditingValue = (state: any, value: string): any => {
  const editingIcon = IconTheme.getFileIcon({ name: value })
  return {
    ...state,
    editingValue: value,
    editingIcon,
  }
}
