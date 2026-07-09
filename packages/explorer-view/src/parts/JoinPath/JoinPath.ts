export const joinPath = (parent: string, child: string, pathSeparator: string): string => {
  if (parent.endsWith(pathSeparator)) {
    return `${parent}${child}`
  }
  return `${parent}${pathSeparator}${child}`
}
