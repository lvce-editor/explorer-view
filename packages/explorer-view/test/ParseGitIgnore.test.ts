import { expect, test } from '@jest/globals'
import { parseGitIgnore } from '../src/parts/ParseGitIgnore/ParseGitIgnore.ts'

test('parseGitIgnore ignores comments and blank lines', () => {
  expect(parseGitIgnore('', '# comment\n\n*.log')).toEqual([
    {
      anchored: false,
      basePath: '',
      directoryOnly: false,
      hasSlash: false,
      negative: false,
      pattern: '*.log',
    },
  ])
})

test('parseGitIgnore parses negation and directory patterns', () => {
  expect(parseGitIgnore('packages/app', 'dist/\n!important.log')).toEqual([
    {
      anchored: false,
      basePath: 'packages/app',
      directoryOnly: true,
      hasSlash: false,
      negative: false,
      pattern: 'dist',
    },
    {
      anchored: false,
      basePath: 'packages/app',
      directoryOnly: false,
      hasSlash: false,
      negative: true,
      pattern: 'important.log',
    },
  ])
})

test('parseGitIgnore parses escaped comment and negation prefixes', () => {
  expect(parseGitIgnore('', '\\#file\n\\!file')).toEqual([
    {
      anchored: false,
      basePath: '',
      directoryOnly: false,
      hasSlash: false,
      negative: false,
      pattern: '#file',
    },
    {
      anchored: false,
      basePath: '',
      directoryOnly: false,
      hasSlash: false,
      negative: false,
      pattern: '!file',
    },
  ])
})

test('parseGitIgnore trims unescaped trailing spaces', () => {
  expect(parseGitIgnore('', 'name   \nspace\\  ')).toEqual([
    {
      anchored: false,
      basePath: '',
      directoryOnly: false,
      hasSlash: false,
      negative: false,
      pattern: 'name',
    },
    {
      anchored: false,
      basePath: '',
      directoryOnly: false,
      hasSlash: false,
      negative: false,
      pattern: 'space ',
    },
  ])
})
