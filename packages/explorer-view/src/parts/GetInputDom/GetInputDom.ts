import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as ExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import * as InputName from '../InputName/InputName.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

const getClassName = (hasEditingError: boolean): string => {
  if (hasEditingError) {
    return MergeClassNames.mergeClassNames(ClassNames.InputBox, ClassNames.InputValidationError)
  }
  return ClassNames.InputBox
}

export const getInputDom = (hasEditingError: boolean): readonly VirtualDomNode[] => {
  const ariaLabel = ExplorerStrings.typeAFileName()
  return [
    {
      type: VirtualDomElements.Input,
      ariaLabel: ariaLabel,
      autocapitalize: 'off',
      autocorrect: 'off',
      childCount: 0,
      className: getClassName(hasEditingError),
      id: 'ExplorerInput',
      name: InputName.ExplorerInput,
      onBlur: DomEventListenerFunctions.HandleInputBlur,
      onClick: DomEventListenerFunctions.HandleInputClick,
      onInput: DomEventListenerFunctions.HandleEditingInput,
      spellcheck: 'false',
    },
  ]
}
