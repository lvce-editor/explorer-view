import * as UpdateIcon from '../UpdateIcon/UpdateIcon.ts'

export const updateIcons = (state: any): any => {
  const newDirents = state.items.map(UpdateIcon.updateIcon)
  return {
    ...state,
    items: newDirents,
  }
}
