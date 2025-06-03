export const getScrollBarTop = (height: number, contentHeight: number, scrollTop: number): number => {
  const scrollBarTop = Math.round((scrollTop / contentHeight) * height)
  return scrollBarTop
}
