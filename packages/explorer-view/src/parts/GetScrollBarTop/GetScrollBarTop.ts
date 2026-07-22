export const getScrollBarTop = (height: number, contentHeight: number, scrollTop: number, scrollBarHeight: number): number => {
  const finalScrollTop = contentHeight - height
  if (finalScrollTop <= 0 || !Number.isFinite(finalScrollTop)) {
    return 0
  }
  const scrollBarTop = Math.round((scrollTop / finalScrollTop) * (height - scrollBarHeight))
  if (!Number.isFinite(scrollBarTop)) {
    return 0
  }
  return scrollBarTop
}
