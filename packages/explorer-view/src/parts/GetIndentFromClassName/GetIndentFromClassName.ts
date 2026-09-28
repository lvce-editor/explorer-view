const indentRegex = /(?:^| )Indent-(\d+)(?: |$)/

export const getIndentFromClassName = (className: string): number => {
  const match = className.match(indentRegex)
  return match ? Number.parseInt(match[1]) : 0
}
