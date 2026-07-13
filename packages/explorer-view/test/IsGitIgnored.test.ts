import { expect, test } from '@jest/globals'
import type { GitIgnorePattern } from '../src/parts/GitIgnorePattern/GitIgnorePattern.ts'
import { isGitIgnored } from '../src/parts/IsGitIgnored/IsGitIgnored.ts'
import { parseGitIgnore } from '../src/parts/ParseGitIgnore/ParseGitIgnore.ts'

const patterns = (content: string, basePath = ''): readonly GitIgnorePattern[] => {
  return parseGitIgnore(basePath, content)
}

test('isGitIgnored matches basename globs at any depth', () => {
  const parsed = patterns('*.log')
  expect(isGitIgnored('debug.log', parsed)).toBe(true)
  expect(isGitIgnored('nested/debug.log', parsed)).toBe(true)
  expect(isGitIgnored('debug.txt', parsed)).toBe(false)
})

test('isGitIgnored matches anchored patterns relative to gitignore file', () => {
  const parsed = patterns('/root-only.txt')
  expect(isGitIgnored('root-only.txt', parsed)).toBe(true)
  expect(isGitIgnored('nested/root-only.txt', parsed)).toBe(false)
})

test('isGitIgnored matches directory patterns and descendants', () => {
  const parsed = patterns('dist/')
  expect(isGitIgnored('dist', parsed)).toBe(true)
  expect(isGitIgnored('dist/app.js', parsed)).toBe(true)
  expect(isGitIgnored('packages/dist/app.js', parsed)).toBe(true)
})

test('isGitIgnored supports include patterns after exclude patterns', () => {
  const parsed = patterns('*.log\n!important.log')
  expect(isGitIgnored('debug.log', parsed)).toBe(true)
  expect(isGitIgnored('important.log', parsed)).toBe(false)
})

test('isGitIgnored supports double star globs', () => {
  const parsed = patterns('src/**/generated/*.ts')
  expect(isGitIgnored('src/generated/file.ts', parsed)).toBe(true)
  expect(isGitIgnored('src/a/b/generated/file.ts', parsed)).toBe(true)
  expect(isGitIgnored('src/a/b/generated/file.js', parsed)).toBe(false)
})

test('isGitIgnored applies nested gitignore files only within their base path', () => {
  const parsed = patterns('*.tmp', 'packages/app')
  expect(isGitIgnored('packages/app/file.tmp', parsed)).toBe(true)
  expect(isGitIgnored('packages/other/file.tmp', parsed)).toBe(false)
})
