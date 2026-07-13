import type { GitIgnorePattern } from '../GitIgnorePattern/GitIgnorePattern.ts'

const lineSeparatorRegex = /\r?\n/

const stripTrailingSpaces = (line: string): string => {
  let end = line.length
  while (end > 0 && line[end - 1] === ' ' && line[end - 2] !== '\\') {
    end--
  }
  return line.slice(0, end).replaceAll('\\ ', ' ')
}

const parseLine = (basePath: string, line: string): GitIgnorePattern | undefined => {
  line = stripTrailingSpaces(line)
  if (!line || line.startsWith('#')) {
    return undefined
  }
  let negative = false
  if (line.startsWith('\\!')) {
    line = line.slice(1)
  } else if (line.startsWith('!')) {
    negative = true
    line = line.slice(1)
  }
  const anchored = line.startsWith('/')
  line = line.replaceAll('\\#', '#').replaceAll('\\!', '!')
  const directoryOnly = line.endsWith('/')
  if (directoryOnly) {
    line = line.slice(0, -1)
  }
  while (line.startsWith('/')) {
    line = line.slice(1)
  }
  if (!line) {
    return undefined
  }
  return {
    anchored,
    basePath,
    directoryOnly,
    hasSlash: line.includes('/'),
    negative,
    pattern: line,
  }
}

export const parseGitIgnore = (basePath: string, content: string): readonly GitIgnorePattern[] => {
  const patterns: GitIgnorePattern[] = []
  for (const line of content.split(lineSeparatorRegex)) {
    const pattern = parseLine(basePath, line)
    if (pattern) {
      patterns.push(pattern)
    }
  }
  return patterns
}
