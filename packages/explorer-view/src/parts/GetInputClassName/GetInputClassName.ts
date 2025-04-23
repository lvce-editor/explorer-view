import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'

export const getInputClassName = (hasEditingError: boolean): string => {
  if (hasEditingError) {
    return MergeClassNames.mergeClassNames(ClassNames.InputBox, ClassNames.InputValidationError)
  }
  return ClassNames.InputBox
}
