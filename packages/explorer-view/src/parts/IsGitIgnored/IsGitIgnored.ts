import type { GitIgnorePattern } from '../GitIgnorePattern/GitIgnorePattern.ts'

const regexSpecialCharacters = /[|\\{}()[\]^$+?.]/g

const escapeRegex = (text: string): string => {
  return text.replaceAll(regexSpecialCharacters, '\\$&')
}

const globToRegex = (glob: string): RegExp => {
  let regex = '^'
  for (let i = 0; i < glob.length; i++) {
    const char = glob[i]
    const next = glob[i + 1]
    if (char === '*' && next === '*') {
      if (glob[i + 2] === '/') {
        regex += '(?:.*/)?'
        i += 2
      } else {
        regex += '.*'
        i++
      }
    } else if (char === '*') {
      regex += '[^/]*'
    } else if (char === '?') {
      regex += '[^/]'
    } else {
      regex += escapeRegex(char)
    }
  }
  regex += '$'
  return new RegExp(regex)
}

const isWithinBase = (relativePath: string, basePath: string): boolean => {
  return !basePath || relativePath === basePath || relativePath.startsWith(`${basePath}/`)
}

const getBaseRelativePath = (relativePath: string, basePath: string): string => {
  if (!basePath) {
    return relativePath
  }
  if (relativePath === basePath) {
    return ''
  }
  return relativePath.slice(basePath.length + 1)
}

const matchesDirectoryPattern = (baseRelativePath: string, pattern: GitIgnorePattern): boolean => {
  if (pattern.hasSlash || pattern.anchored) {
    return baseRelativePath === pattern.pattern || baseRelativePath.startsWith(`${pattern.pattern}/`)
  }
  return baseRelativePath.split('/').includes(pattern.pattern)
}

const matchesPathPattern = (baseRelativePath: string, pattern: GitIgnorePattern): boolean => {
  const regex = globToRegex(pattern.pattern)
  if (pattern.hasSlash || pattern.anchored) {
    return regex.test(baseRelativePath)
  }
  return baseRelativePath.split('/').some((part) => regex.test(part))
}

const matchesPattern = (baseRelativePath: string, pattern: GitIgnorePattern): boolean => {
  if (!baseRelativePath) {
    return false
  }
  if (pattern.directoryOnly) {
    return matchesDirectoryPattern(baseRelativePath, pattern)
  }
  return matchesPathPattern(baseRelativePath, pattern)
}

export const isGitIgnored = (relativePath: string, patterns: readonly GitIgnorePattern[]): boolean => {
  let ignored = false
  for (const pattern of patterns) {
    if (!isWithinBase(relativePath, pattern.basePath)) {
      continue
    }
    const baseRelativePath = getBaseRelativePath(relativePath, pattern.basePath)
    if (matchesPattern(baseRelativePath, pattern)) {
      ignored = !pattern.negative
    }
  }
  return ignored
}
