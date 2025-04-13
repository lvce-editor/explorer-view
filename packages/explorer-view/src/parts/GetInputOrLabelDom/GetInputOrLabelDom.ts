import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../InputName/InputName.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const label: VirtualDomNode = {
  type: VirtualDomElements.Div,
  className: ClassNames.Label,
  childCount: 1,
}

const getClassName = (hasEditingError: boolean): string => {
  if (hasEditingError) {
    return MergeClassNames.mergeClassNames(ClassNames.InputBox, ClassNames.InputValidationError)
  }
  return ClassNames.InputBox
}

export const getInputOrLabelDom = (isEditing: boolean, hasEditingError: boolean, name: string): readonly VirtualDomNode[] => {
  if (isEditing) {
    return [
      {
        type: VirtualDomElements.Input,
        className: getClassName(hasEditingError),
        id: 'ExplorerInput',
        onInput: DomEventListenerFunctions.HandleEditingInput,
        childCount: 0,
        name: InputName.ExplorerInput,
      },
    ]
  }
  return [label, text(name)]
}
