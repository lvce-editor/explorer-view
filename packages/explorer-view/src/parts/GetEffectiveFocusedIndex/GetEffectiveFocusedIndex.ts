export const getEffectiveFocusedIndex = (focusedIndex: number, pendingFocusedIndex: number): number => {
  if (pendingFocusedIndex !== -1) {
    return pendingFocusedIndex
  }
  return focusedIndex
}
