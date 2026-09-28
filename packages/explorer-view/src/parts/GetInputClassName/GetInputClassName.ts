import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'

const inputErrorClassName = MergeClassNames.mergeClassNames(ClassNames.ExplorerInputBox, ClassNames.InputValidationError)

export const getInputClassName = (hasEditingError: boolean): string => {
  if (hasEditingError) {
    return inputErrorClassName
  }
  return ClassNames.ExplorerInputBox
}
