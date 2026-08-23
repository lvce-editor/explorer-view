import { readdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { execa } from 'execa'
import { root } from './root.ts'

const maximumTestsPerRun = 100
const testPrefix = 'viewlet.explorer'
const e2ePath = join(root, 'packages', 'e2e')
const testSourcePath = join(e2ePath, 'src')
const require = createRequire(join(e2ePath, 'package.json'))
const testWithPlaywrightPackagePath = require.resolve('@lvce-editor/test-with-playwright/package.json')
const testWithPlaywrightPath = join(dirname(testWithPlaywrightPackagePath), 'bin', 'test-with-playwright.js')

interface TestGroup {
  readonly names: readonly string[]
  readonly prefix: string
}

const getTestFilters = (testNames: readonly string[]): readonly string[] => {
  const pending: TestGroup[] = [{ names: testNames, prefix: testPrefix }]
  const filters: string[] = []
  while (pending.length > 0) {
    const group = pending.pop()
    if (!group) {
      break
    }
    if (group.names.length <= maximumTestsPerRun) {
      filters.push(group.prefix)
      continue
    }
    const subgroups = new Map<string, string[]>()
    for (const name of group.names) {
      const nextCharacter = name[group.prefix.length]
      if (!nextCharacter) {
        throw new Error(`Cannot split WebKit test group ${group.prefix}`)
      }
      const names = subgroups.get(nextCharacter) || []
      names.push(name)
      subgroups.set(nextCharacter, names)
    }
    for (const [nextCharacter, names] of subgroups) {
      pending.push({ names, prefix: `${group.prefix}${nextCharacter}` })
    }
  }
  return filters.toSorted((a, b) => a.localeCompare(b))
}

const runTestGroup = async (filter: string, extraArguments: readonly string[]): Promise<void> => {
  await execa(
    process.execPath,
    [
      testWithPlaywrightPath,
      '--only-extension=.',
      '--test-path=.',
      '--browser=webkit',
      ...extraArguments,
      `--filter=${filter}`,
    ],
    {
      cwd: e2ePath,
      stdio: 'inherit',
    },
  )
}

const main = async (): Promise<void> => {
  const sourceFiles = await readdir(testSourcePath)
  const testNames = sourceFiles.filter((name) => name.startsWith(testPrefix) && name.endsWith('.ts'))
  if (testNames.length === 0) {
    throw new Error('No WebKit tests found')
  }
  const filters = getTestFilters(testNames)
  const extraArguments = process.argv.slice(2)
  for (const filter of filters) {
    await runTestGroup(filter, extraArguments)
  }
}

if (import.meta.main) {
  await main()
}
