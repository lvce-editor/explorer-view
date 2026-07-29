interface Result {
  readonly handleOffset: number
  readonly percent: number
}

export const getNewDeltaYPercent = (height: number, scrollBarHeight: number, relativeY: number): Result => {
  const halfScrollBarHeight = scrollBarHeight / 2
  if (relativeY <= halfScrollBarHeight) {
    return {
      handleOffset: relativeY,
      percent: 0,
    }
  }
  if (relativeY <= height - halfScrollBarHeight) {
    return {
      handleOffset: halfScrollBarHeight,
      percent: (relativeY - halfScrollBarHeight) / (height - scrollBarHeight),
    }
  }
  return {
    handleOffset: scrollBarHeight - height + relativeY,
    percent: 1,
  }
}
