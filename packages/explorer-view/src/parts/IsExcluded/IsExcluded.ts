import { matchesGlob } from '../MatchesGlob/MatchesGlob.ts'

const leadingSlashRegex = /^\//
const trailingSlashRegex = /\/$/

const getRelativePath = (root: string, path: string): string => {
  const normalizedRoot = root.replaceAll('\\', '/').replace(trailingSlashRegex, '')
  const normalizedPath = path.replaceAll('\\', '/')
  if (normalizedPath === normalizedRoot) {
    return ''
  }
  if (normalizedPath.startsWith(`${normalizedRoot}/`)) {
    return normalizedPath.slice(normalizedRoot.length + 1)
  }
  return normalizedPath.replace(leadingSlashRegex, '')
}

export const isExcluded = (root: string, path: string, excluded: readonly string[]): boolean => {
  const relativePath = getRelativePath(root, path)
  const pathParts = relativePath.split('/')
  for (let i = 1; i <= pathParts.length; i++) {
    const candidate = pathParts.slice(0, i).join('/')
    if (excluded.some((pattern) => matchesGlob(pattern, candidate))) {
      return true
    }
  }
  return false
}
