import { spawn } from 'node:child_process'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const maximumTestsPerRun = 100
const testPrefix = 'viewlet.explorer'
const testSourcePath = join(import.meta.dirname, '..', 'src')
const testWithPlaywrightPath = fileURLToPath(import.meta.resolve('@lvce-editor/test-with-playwright/bin/test-with-playwright.js'))

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
  const child = spawn(
    process.execPath,
    [testWithPlaywrightPath, '--only-extension=.', '--test-path=.', '--browser=webkit', ...extraArguments, `--filter=${filter}`],
    { stdio: 'inherit' },
  )
  const exitCode = await new Promise<number | null>((resolve, reject) => {
    child.once('error', reject)
    child.once('exit', (code) => resolve(code))
  })
  if (exitCode !== 0) {
    throw new Error(`WebKit test group ${filter} exited with code ${exitCode}`)
  }
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
