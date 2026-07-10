import { expect, test } from '@jest/globals'
import { matchesGlob } from '../src/parts/MatchesGlob/MatchesGlob.ts'

test.each([
  ['**/.git', '.git', true],
  ['**/.git', 'packages/app/.git', true],
  ['**/.git', '.github', false],
  ['**/.git', '.gitignore', false],
  ['**/Thumbs.db', 'Thumbs.db', true],
  ['**/Thumbs.db', 'images/Thumbs.db', true],
  ['**/Thumbs.db', 'images/thumbs.db', false],
  ['**/*.map', 'app.js.map', true],
  ['**/*.map', 'dist/app.js.map', true],
  ['**/*.map', 'dist/app.js', false],
  ['src/generated', 'src/generated', true],
  ['src/generated', 'other/src/generated', false],
  ['build/**', 'build', false],
  ['build/**', 'build/output/app.js', true],
  ['*.log', 'nested/debug.log', true],
  ['file?.txt', 'file1.txt', true],
  ['file?.txt', 'file10.txt', false],
  ['./cache', 'cache', true],
  ['/cache', 'cache', true],
  ['', 'anything', false],
])('matchesGlob(%s, %s)', (pattern, path, expected) => {
  expect(matchesGlob(pattern, path)).toBe(expected)
})
