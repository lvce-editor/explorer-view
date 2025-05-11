export interface Position {
  readonly left: number
  readonly top: number
}

export const getErrorMessagePosition = (
  itemHeight: number,
  focusedIndex: number,
  minLineY: number,
  depth: number,
  indent: number,
  fileIconWidth: number,
  padding: number,
): Position => {
  const top = itemHeight * (focusedIndex - minLineY + 1)
  const left = depth * indent + fileIconWidth + padding
  return {
    top,
    left,
  }
}
