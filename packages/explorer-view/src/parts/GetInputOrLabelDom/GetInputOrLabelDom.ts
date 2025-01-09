import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../InputName/InputName.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const label: VirtualDomNode = {
  type: VirtualDomElements.Div,
  className: ClassNames.Label,
  childCount: 1,
}

export const getInputOrLabelDom = (isEditing: boolean, name: string): readonly VirtualDomNode[] => {
  if (isEditing) {
    return [
      {
        type: VirtualDomElements.Input,
        className: ClassNames.InputBox,
        id: 'ExplorerInput',
        onInput: DomEventListenerFunctions.HandleEditingInput,
        childCount: 0,
        name: InputName.ExplorerInput,
      },
    ]
  }
  return [label, text(name)]
}
