interface ScrollIntoResult {
  readonly newMinLineY: number
  readonly newMaxLineY: number
}

export const scrollInto = (index: number, minLineY: number, maxLineY: number): ScrollIntoResult => {
  const diff = maxLineY - minLineY
  const smallerHalf = Math.floor(diff / 2)
  const largerHalf = diff - smallerHalf
  if (index < minLineY) {
    return {
      newMinLineY: index - smallerHalf,
      newMaxLineY: index + largerHalf,
    }
  }
  if (index >= maxLineY) {
    return {
      newMinLineY: index - smallerHalf,
      newMaxLineY: index + largerHalf,
    }
  }
  return {
    newMinLineY: minLineY,
    newMaxLineY: maxLineY,
  }
}
