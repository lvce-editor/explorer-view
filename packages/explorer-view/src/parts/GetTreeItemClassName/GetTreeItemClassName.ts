import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'

const focused = MergeClassNames.mergeClassNames(ClassNames.TreeItem, ClassNames.TreeItemActive)
const selected = MergeClassNames.mergeClassNames(ClassNames.TreeItem, ClassNames.TreeItemActive)

export const getTreeItemClassName = (isSelected: boolean, isFocused: boolean): string => {
  if (isFocused) {
    return focused
  }
  if (isSelected) {
    return selected
  }
  return ClassNames.TreeItem
}
