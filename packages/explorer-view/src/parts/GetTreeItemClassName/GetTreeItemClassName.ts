import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'

export const getTreeItemClassName = (isSelected: boolean, isFocused: boolean, isDropping: boolean): string => {
  let className = ClassNames.TreeItem
  if (isSelected || isFocused) {
    className = MergeClassNames.mergeClassNames(className, ClassNames.TreeItemActive)
  }
  if (isDropping) {
    className = MergeClassNames.mergeClassNames(className, 'DropTarget')
  }
  return className
}
