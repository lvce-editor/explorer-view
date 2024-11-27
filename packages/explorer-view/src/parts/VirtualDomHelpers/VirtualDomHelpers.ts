import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const text = (data: string): any => {
  return {
    type: VirtualDomElements.Text,
    text: data,
    childCount: 0,
  }
}
