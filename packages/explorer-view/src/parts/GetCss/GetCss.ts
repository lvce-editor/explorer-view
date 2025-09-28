export const getCss = (scrollBarHeight: number, uniqueIndents: readonly number[]): string => {
  // TODO each visible item should have an indent property
  const rules = [
    `.Explorer {
  --ScrollBarThumbHeight: ${scrollBarHeight}px;
}`,
  ]
  for (const item of uniqueIndents) {
    rules.push(`.Indent-${item} {
  padding-left: ${item}px;
}`)
  }
  const css = rules.join('\n')
  return css
}
