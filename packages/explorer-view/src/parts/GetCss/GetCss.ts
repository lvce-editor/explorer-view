const getIndentRule = (indent: number): string => {
  return `.Indent-${indent} {
  padding-left: ${indent}px;
}`
}

export const getCss = (scrollBarHeight: number, uniqueIndents: readonly number[], errorMessageLeft: number, errorMessageTop: number): string => {
  const rules = [
    `.Explorer {
  --ScrollBarThumbHeight: ${scrollBarHeight}px;
  --ErrorMessageTop: ${errorMessageTop}px;
  --ErrorMessageLeft: ${errorMessageLeft}px;
}`,
    ...uniqueIndents.map(getIndentRule),
  ]
  const css = rules.join('\n')
  return css
}
