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

interface CompiledGitIgnorePattern {
  readonly pattern: GitIgnorePattern
  readonly regex: RegExp | undefined
}

const compilePatterns = (patterns: readonly GitIgnorePattern[]): readonly CompiledGitIgnorePattern[] => {
  return patterns.map((pattern) => ({
    pattern,
    regex: pattern.directoryOnly ? undefined : globToRegex(pattern.pattern),
  }))
}

const matchesPathPattern = (baseRelativePath: string, pattern: GitIgnorePattern, regex: RegExp): boolean => {
  if (pattern.hasSlash || pattern.anchored) {
    return regex.test(baseRelativePath)
  }
  return baseRelativePath.split('/').some((part) => regex.test(part))
}

const matchesPattern = (baseRelativePath: string, pattern: GitIgnorePattern, regex: RegExp | undefined): boolean => {
  if (!baseRelativePath) {
    return false
  }
  if (pattern.directoryOnly) {
    return matchesDirectoryPattern(baseRelativePath, pattern)
  }
  return regex !== undefined && matchesPathPattern(baseRelativePath, pattern, regex)
}

export const createGitIgnoreMatcher = (patterns: readonly GitIgnorePattern[]): ((relativePath: string) => boolean) => {
  const compiledPatterns = compilePatterns(patterns)
  return (relativePath: string): boolean => {
    let ignored = false
    for (const { pattern, regex } of compiledPatterns) {
      if (!isWithinBase(relativePath, pattern.basePath)) {
        continue
      }
      const baseRelativePath = getBaseRelativePath(relativePath, pattern.basePath)
      if (matchesPattern(baseRelativePath, pattern, regex)) {
        ignored = !pattern.negative
      }
    }
    return ignored
  }
}

export const isGitIgnored = (relativePath: string, patterns: readonly GitIgnorePattern[]): boolean => {
  return createGitIgnoreMatcher(patterns)(relativePath)
}
