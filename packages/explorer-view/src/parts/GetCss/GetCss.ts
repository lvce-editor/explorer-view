import { getIndentRule } from '../GetIndentRule/GetIndentRule.ts'

export const getCss = (
  scrollBarHeight: number,
  scrollBarTop: number,
  uniqueIndents: readonly number[],
  errorMessageLeft: number,
  errorMessageTop: number,
  errorMessageWidth: number,
  relative = 0,
): string => {
  const listItemsOffset = relative === 0 ? '' : `  --ListItemsOffset: ${relative}px;\n`
  const listItemsRule =
    relative === 0
      ? ''
      : `
.Explorer .ListItems > .TreeItem:first-child {
  margin-top: var(--ListItemsOffset);
}`
  const rules = [
    `.Explorer {
  --ScrollBarThumbHeight: ${scrollBarHeight}px;
  --ScrollBarThumbTop: ${scrollBarTop}px;
${listItemsOffset}  --ErrorMessageTop: ${errorMessageTop}px;
  --ErrorMessageLeft: ${errorMessageLeft}px;
  --ErrorMessageWidth: ${errorMessageWidth}px;
}
.Explorer .ScrollBarThumb {
  height: var(--ScrollBarThumbHeight);
  top: 0;
  translate: 0px var(--ScrollBarThumbTop);
}${listItemsRule}`,
    ...uniqueIndents.map(getIndentRule),
  ]
  const css = rules.join('\n')
  return css
}
