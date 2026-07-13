const trimLeadingSeparator = (path: string): string => {
  return path.startsWith('/') ? path.slice(1) : path
}

const toSlashPath = (path: string, pathSeparator: string): string => {
  if (pathSeparator === '/') {
    return path
  }
  return path.replaceAll(pathSeparator, '/')
}

export const getGitIgnoreRelativePath = (root: string, path: string, pathSeparator: string): string => {
  const slashRoot = toSlashPath(root, pathSeparator)
  const slashPath = toSlashPath(path, pathSeparator)
  if (slashPath === slashRoot) {
    return ''
  }
  if (slashRoot.endsWith('/')) {
    return slashPath.slice(slashRoot.length)
  }
  return trimLeadingSeparator(slashPath.slice(slashRoot.length))
}
