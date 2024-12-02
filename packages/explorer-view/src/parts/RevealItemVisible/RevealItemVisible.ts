import * as ScrollInto from '../ScrollInto/ScrollInto.ts'

export const revealItemVisible = (state: any, index: number): any => {
  const { minLineY, maxLineY } = state
  const { newMinLineY, newMaxLineY } = ScrollInto.scrollInto(index, minLineY, maxLineY)
  return {
    ...state,
    focused: true,
    focusedIndex: index,
    minLineY: newMinLineY,
    maxLineY: newMaxLineY,
  }
}
