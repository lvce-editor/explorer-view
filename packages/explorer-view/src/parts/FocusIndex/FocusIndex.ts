export const focusIndex = (state: any, index: number): any => {
  const { minLineY, maxLineY } = state
  if (index < minLineY) {
    if (index < 0) {
      return {
        ...state,
        focusedIndex: index,
        focused: true,
      }
    }
    const diff = maxLineY - minLineY
    return {
      ...state,
      focusedIndex: index,
      focused: true,
      minLineY: index,
      maxLineY: index + diff,
    }
  }
  if (index >= maxLineY) {
    const diff = maxLineY - minLineY
    return {
      ...state,
      focusedIndex: index,
      focused: true,
      minLineY: index + 1 - diff,
      maxLineY: index + 1,
    }
  }
  return {
    ...state,
    focusedIndex: index,
    focused: true,
  }
}
