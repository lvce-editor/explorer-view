import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { GitIgnorePattern } from '../GitIgnorePattern/GitIgnorePattern.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetGitIgnoreCandidateDirs from '../GetGitIgnoreCandidateDirs/GetGitIgnoreCandidateDirs.ts'
import * as GetGitIgnoreRelativePath from '../GetGitIgnoreRelativePath/GetGitIgnoreRelativePath.ts'
import { joinPath } from '../JoinPath/JoinPath.ts'
import * as ParseGitIgnore from '../ParseGitIgnore/ParseGitIgnore.ts'

const readGitIgnoreFile = async (root: string, dir: string, pathSeparator: string): Promise<readonly GitIgnorePattern[]> => {
  try {
    const content = await FileSystem.readFile(joinPath(dir, '.gitignore', pathSeparator))
    const basePath = GetGitIgnoreRelativePath.getGitIgnoreRelativePath(root, dir, pathSeparator)
    return ParseGitIgnore.parseGitIgnore(basePath, content)
  } catch {
    return []
  }
}

export const getGitIgnoreFiles = async (
  root: string,
  items: readonly ExplorerItem[],
  pathSeparator: string,
): Promise<readonly GitIgnorePattern[]> => {
  const dirs = GetGitIgnoreCandidateDirs.getGitIgnoreCandidateDirs(root, items, pathSeparator)
  const nestedPatterns = await Promise.all(
    dirs.map((dir) => {
      return readGitIgnoreFile(root, dir, pathSeparator)
    }),
  )
  return nestedPatterns.flat()
}
