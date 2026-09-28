import { text } from '@lvce-editor/virtual-dom-worker'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

const parentNode: VirtualDomNode = {
  childCount: 1,
  className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.Explorer),
  role: AriaRoles.None,
  type: VirtualDomElements.Div,
}

const messageNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.WelcomeMessage,
  role: AriaRoles.Status,
  type: VirtualDomElements.P,
}

export const getWorkspaceProgressVirtualDom = (message: string): readonly VirtualDomNode[] => {
  return [parentNode, messageNode, text(message)]
}
